import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";

import users from "../data/users";

export default function LoginScreen({ navigation }) {
  const [mode, setMode] = useState("login");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "Customer",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Error clear ho jaye jab user field edit kare
    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (mode === "signup" && !form.name.trim()) {
      newErrors.name = "Full name is required";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Enter a valid email";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/\d/.test(form.password)) {
      newErrors.password = "Password must contain at least one digit";
    }

    if (mode === "signup") {
      if (!form.confirmPassword) {
        newErrors.confirmPassword = "Confirm your password";
      } else if (form.password !== form.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      if (mode === "login") {
        const foundUser = users.find(
          (user) =>
            user.email.toLowerCase() === form.email.toLowerCase() &&
            user.password === form.password
        );

        if (!foundUser) {
          setIsSubmitting(false);
          Alert.alert(
            "Login Failed",
            "Invalid email or password. Please try again."
          );
          return;
        }

        setIsSubmitting(false);

        if (foundUser.role === "Manager") {
          navigation.navigate("ManagerDashboard");
        } else {
          navigation.navigate("Menu");
        }
      } else {
        const alreadyExists = users.some(
          (user) => user.email.toLowerCase() === form.email.toLowerCase()
        );

        if (alreadyExists) {
          setIsSubmitting(false);
          Alert.alert(
            "Account Exists",
            "An account with this email already exists."
          );
          return;
        }

        const newUser = {
          id: String(users.length + 1),
          name: form.name,
          email: form.email,
          password: form.password,
          role: form.role,
        };

        users.push(newUser);

        setIsSubmitting(false);

        Alert.alert(
          "Signup Successful",
          "Your account has been created. Please login."
        );

        setMode("login");

        setForm({
          name: "",
          email: form.email,
          password: "",
          confirmPassword: "",
          role: "Customer",
        });
      }
    }, 1000);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Restaurant App</Text>
        <Text style={styles.subtitle}>
          {mode === "login" ? "Welcome Back!" : "Create Your Account"}
        </Text>

        <View style={styles.modeContainer}>
          <TouchableOpacity
            style={[
              styles.modeButton,
              mode === "login" && styles.activeMode,
            ]}
            onPress={() => {
              setMode("login");
              setErrors({});
            }}
          >
            <Text
              style={[
                styles.modeText,
                mode === "login" && styles.activeModeText,
              ]}
            >
              Login
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.modeButton,
              mode === "signup" && styles.activeMode,
            ]}
            onPress={() => {
              setMode("signup");
              setErrors({});
            }}
          >
            <Text
              style={[
                styles.modeText,
                mode === "signup" && styles.activeModeText,
              ]}
            >
              Signup
            </Text>
          </TouchableOpacity>
        </View>

        {mode === "signup" && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={form.name}
              onChangeText={(text) => updateField("name", text)}
            />

            {errors.name ? (
              <Text style={styles.error}>{errors.name}</Text>
            ) : null}
          </>
        )}

        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={form.email}
          onChangeText={(text) => updateField("email", text)}
        />

        {errors.email ? (
          <Text style={styles.error}>{errors.email}</Text>
        ) : null}

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            secureTextEntry={!showPassword}
            value={form.password}
            onChangeText={(text) => updateField("password", text)}
          />

          <TouchableOpacity
            onPress={() => setShowPassword((prev) => !prev)}
          >
            <Text style={styles.showText}>
              {showPassword ? "Hide" : "Show"}
            </Text>
          </TouchableOpacity>
        </View>

        {errors.password ? (
          <Text style={styles.error}>{errors.password}</Text>
        ) : null}

        {mode === "signup" && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              secureTextEntry={!showPassword}
              value={form.confirmPassword}
              onChangeText={(text) =>
                updateField("confirmPassword", text)
              }
            />

            {errors.confirmPassword ? (
              <Text style={styles.error}>
                {errors.confirmPassword}
              </Text>
            ) : null}

            <Text style={styles.roleTitle}>Select Role</Text>

            <View style={styles.roleContainer}>
              <TouchableOpacity
                style={[
                  styles.roleButton,
                  form.role === "Customer" && styles.selectedRole,
                ]}
                onPress={() => updateField("role", "Customer")}
              >
                <Text>Customer</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.roleButton,
                  form.role === "Manager" && styles.selectedRole,
                ]}
                onPress={() => updateField("role", "Manager")}
              >
                <Text>Manager</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.submitText}>
              {mode === "login" ? "Login" : "Create Account"}
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },

  content: {
    padding: 24,
    justifyContent: "center",
    flexGrow: 1,
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 25,
  },

  modeContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },

  modeButton: {
    flex: 1,
    padding: 13,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "#cccccc",
  },

  activeMode: {
    borderBottomColor: "#000000",
  },

  modeText: {
    fontSize: 16,
    color: "#777777",
  },

  activeModeText: {
    color: "#000000",
    fontWeight: "bold",
  },

  input: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#cccccc",
    borderRadius: 8,
    padding: 14,
    marginBottom: 5,
  },

  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#cccccc",
    borderRadius: 8,
    marginTop: 10,
  },

  passwordInput: {
    flex: 1,
    padding: 14,
  },

  showText: {
    paddingHorizontal: 14,
    fontWeight: "bold",
  },

  error: {
    color: "red",
    fontSize: 13,
    marginBottom: 8,
  },

  roleTitle: {
    marginTop: 15,
    marginBottom: 8,
    fontWeight: "bold",
  },

  roleContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },

  roleButton: {
    flex: 1,
    padding: 13,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#cccccc",
    borderRadius: 8,
    backgroundColor: "#ffffff",
  },

  selectedRole: {
    borderColor: "#000000",
    borderWidth: 2,
  },

  submitButton: {
    backgroundColor: "#000000",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },

  submitText: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "bold",
  },
});
