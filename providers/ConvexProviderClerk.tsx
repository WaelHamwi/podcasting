"use client";
import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";
const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL);
export const ConvexClerkProvider = ({ children }) => (<ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY} appearance={{
        layout: {
            socialButtonsVariant: "iconButton",
            logoImageUrl: "/icons/podcasts.svg",
        },
        variables: {
            colorBackground: "#15151c",
            colorPrimary: "#fcfcfc",
            colorText: "white",
            colorInputBackground: "#1b1f25",
            colorInputText: 'white'
        },
        elements: {
            primaryButton: 'custom-submit-button',
        },
    }}>
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      {children}
    </ConvexProviderWithClerk>
  </ClerkProvider>);
