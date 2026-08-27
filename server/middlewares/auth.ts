import { NextFunction, Request, Response } from "express";
import { clerkMiddleware, clerkClient, getAuth } from '@clerk/express'
import User from "../models/User.js";

export interface AuthRequest extends Request{
    user?: {id: string, name: string, email: string}
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction)=>{
    try {
        const {userId} = getAuth(req)
        if(!userId){
            res.status(401).json({success: false, message: "Unauthenticated"})
            return; 
        }

        // Check if user exists locally in MongoDB
        let localUser = await User.findById(userId);

        if(!localUser){
            // Lazy sync: Fetch details from Clerk API
            const clerkUser = await clerkClient.users.getUser(userId);
            const email = clerkUser.emailAddresses[0]?.emailAddress;
            const name = [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join("") || clerkUser.username || "Anonymous";
            // Create fallback handle
            const handle = clerkUser.username || clerkUser.emailAddresses[0]?.emailAddress.split("@")[0] || userId;

            // Ensure unique handle in DB by appending random suffix if needed
            let finalHandle = handle.toLowerCase().replace(/[^a-z0-9]/g, "");
            let handleExist = await User.findOne({handle: finalHandle})
            let counter = 1;
            while(handleExist){
                const testHandle = `${finalHandle}${counter}`;
                handleExist = await User.findOne({handle: testHandle})
                if(!handleExist){
                    finalHandle = testHandle;
                    break;
                }
                counter++;
            }
            localUser = await User.create({
                _id: userId,
                name,
                email: email.toLowerCase(),
                handle: finalHandle,
                avatar: clerkUser.imageUrl || "",
                bio: "Hey there! I am using Voqra.",
                isOnline: true,
                lastSeen: new Date(),
                
            })
        }

        // Attach user ingo to request for compatibility
        req.user = {
            id: localUser._id,
            name:localUser.name,
            email: localUser.email
        }
        next()


    } catch (error) {
        console.log("Auth Middleware Error: ", error);
        res.status(401).json({success: false, message: "Invalid or expired token"});
    }
}