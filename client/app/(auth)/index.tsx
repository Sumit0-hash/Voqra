import { View, Text, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '@/assets/styles/AuthScreen.styles';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/Colors';
import { SvgXml } from 'react-native-svg';
import { TextInput } from 'react-native-gesture-handler';
import { Ionicons } from "@expo/vector-icons";

type Mode = "login" | "register"

export default function AuthScreen() {
  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [handle, setHandle] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const router = useRouter();

  const handleSubmit = async () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setVerifying(true)
    }, 1500)
  }

  const handleVerify = async ()=> {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      router.replace("/(tabs)")
    }, 1500)
  }

  const svgMarkup = `<svg width="86" height="75" viewBox="0 0 86 75" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.251 59.385s-.693-15.968 4.246-24.97c4.938-9.003 21.044-21.136 21.044-21.136l10.352 10.306zm63.355-12.383s.693-15.968-4.245-24.97C65.423 13.029 49.316.896 49.316.896L38.965 11.203zm-1.217 28s.692-15.968-4.246-24.97c-4.938-9.003-21.044-21.136-21.044-21.136L37.747 39.203z" fill="#fff"/></svg>`

  if (verifying) {
    return (
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView style={styles.kav} behavior={Platform.OS == "ios" ? "padding" : undefined}>
          <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
            {/* LOGO */}
            <View style={styles.logoRow}>
              <LinearGradient colors={[Colors.primary, Colors.primaryContainer]} style={styles.logoBox}>
                <SvgXml xml={svgMarkup} width="50%" height="50%" />
              </LinearGradient>
              <Text style={styles.appName}>Voqra</Text>
            </View>
            {/* Hero text */}
            <Text style={styles.heading}>Verify Email.</Text>
            <Text style={styles.subheading}>
              We have sent a 6-digit verification code to your {email}.
            </Text>

            {/* Form */}
            <View style={styles.form}>
              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Verification Code</Text>
                <TextInput
                  style={styles.input}
                  value={verificationCode}
                  onChangeText={setVerificationCode}
                  placeholder='Enter 6-digit code.'
                  placeholderTextColor={Colors.outlineVariant}
                  keyboardType='number-pad'
                  autoCapitalize='none'
                />
              </View>
              {/* Back to sign up link */}
              <View style={styles.toggleRow}>
                <Text style={styles.toggleText}>Did not receive a code?</Text>
                <TouchableOpacity onPress={()=>setVerifying(false)}>
                  <Text style={styles.toggleLink}>Go Back</Text>
                </TouchableOpacity>
              </View>
              
              {/* Submit */}
              <TouchableOpacity onPress={handleVerify} disabled={loading} activeOpacity={0.88} style={styles.btnWrapper}>
                <LinearGradient
                  colors={[Colors.primary, Colors.primaryContainer]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.btn}
                >
                  {loading ? (
                    <ActivityIndicator color={Colors.onPrimary} size='small' />
                  ) : (
                    <>
                      <Text style={styles.btnText}>Verify Code</Text>
                      <Ionicons name="arrow-forward" size={18} color={Colors.onPrimary} />

                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>

          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={styles.kav} behavior={Platform.OS == "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          {/* LOGO */}
          <View style={styles.logoRow}>
            <LinearGradient colors={[Colors.primary, Colors.primaryContainer]} style={styles.logoBox}>
              <SvgXml xml={svgMarkup} width="50%" height="50%" />
            </LinearGradient>
            <Text style={styles.appName}>Voqra</Text>
          </View>
          {/* Hero text */}
          <Text style={styles.heading}>{mode === "login" ? "Welcome back 👋" : "Create account."}</Text>
          <Text style={styles.subheading}>
            {mode === "login" ? "Sign in to continue chatting." : "Fill in your details to get started."}
          </Text>

          {/* Form */}
          <View style={styles.form}>
            {mode === "register" && (
              <>
                <View style={styles.field}>
                  <Text style={styles.fieldLabel}>Full Name</Text>
                  <TextInput style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder='Your name'
                    placeholderTextColor={Colors.outlineVariant}
                    autoCapitalize='words'
                  />
                </View>
                <View style={styles.field}>
                  <Text style={styles.fieldLabel}>Username Handle</Text>
                  <View style={styles.handleRow}>
                    <Text style={styles.atSign}>@</Text>
                    <TextInput
                      style={[styles.input, styles.handleInput]}
                      value={handle}
                      onChangeText={(v) => setHandle(v.toLowerCase().replace(/\s/g, ""))}
                      placeholder='username'
                      placeholderTextColor={Colors.outlineVariant}
                      autoCapitalize='none'
                    />
                  </View>
                </View>
              </>
            )}
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Email</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder='your@example.com'
                placeholderTextColor={Colors.outlineVariant}
                keyboardType='email-address'
                autoCapitalize='none'
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Password</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder='•••••••••'
                placeholderTextColor={Colors.outlineVariant}
                secureTextEntry
              />
            </View>
            {/* Toggle mode */}
            <View style={styles.toggleRow}>
              <Text style={styles.toggleText}>{mode === "login" ? "Don't have an account ?" : "Already have an account ?"}</Text>
              <TouchableOpacity onPress={() => setMode(mode === "login" ?
                "register" : "login"
              )}>
                <Text style={styles.toggleLink}>{mode === "login" ? "Sign Up" : "Sign In"}</Text>
              </TouchableOpacity>
            </View>
            {/* Submit */}
            <TouchableOpacity onPress={handleSubmit} disabled={loading} activeOpacity={0.88} style={styles.btnWrapper}>
              <LinearGradient
                colors={[Colors.primary, Colors.primaryContainer]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.btn}
              >
                {loading ? (
                  <ActivityIndicator color={Colors.onPrimary} size='small' />
                ) : (
                  <>
                    <Text style={styles.btnText}>{mode === "login" ? "Sign In" : "Create Account"}</Text>
                    <Ionicons name="arrow-forward" size={18} color={Colors.onPrimary} />

                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}