import LogoWithText from "@/components/LogoWithText";
import React from "react";
import {ScrollView, Text, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";

const PrivacyPolicy = () => {
  return (
    <SafeAreaView className="flex-1 px-6 bg-white " edges={["bottom"]}>
      <ScrollView className="flex-1 py-6" showsVerticalScrollIndicator={false}>
        <LogoWithText />
        {/* Purpose */}
        <View className="my-6">
          <Text className="text-xl font-bold text-[#0F2535] mb-3">
            1. Purpose
          </Text>
          <Text className="text-sm leading-relaxed text-gray-700">
            This policy outlines the guidelines and procedures for the safe,
            efficient, and compliant operation of commercial motor vehicles by
            [Company Name]. It is designed to ensure the safety of our drivers,
            the public, and the integrity of the cargo we transport.
          </Text>
        </View>

        {/* Scope */}
        <View className="mb-6">
          <Text className="text-xl font-bold text-[#0F2535] mb-3">
            2. Scope
          </Text>
          <Text className="text-sm leading-relaxed text-gray-700">
            This policy applies to all employees, contractors, and other
            personnel who operate commercial motor vehicles on behalf of
            [Company Name].
          </Text>
        </View>

        {/* Driver Qualifications */}
        <View className="mb-6">
          <Text className="text-xl font-bold text-[#0F2535] mb-3">
            3. Driver Qualifications and Conduct
          </Text>

          <Text className="text-base font-semibold text-[#FFA840] mb-1">
            3.1. Licensing
          </Text>
          <Text className="mb-2 text-sm leading-relaxed text-gray-700">
            • All drivers must possess a valid Commercial Driver's License (CDL)
            with the appropriate endorsements.{"\n"}• Drivers must notify the
            company immediately of any license suspensions, revocations, or
            violations.
          </Text>

          <Text className="text-base font-semibold text-[#FFA840] mb-1">
            3.2. Driving Record
          </Text>
          <Text className="mb-2 text-sm leading-relaxed text-gray-700">
            • The company will conduct regular reviews of driver's motor vehicle
            records (MVRs).{"\n"}• Drivers with excessive violations may be
            subject to disciplinary action, including termination.
          </Text>

          <Text className="text-base font-semibold text-[#FFA840] mb-1">
            3.3. Drug and Alcohol Policy
          </Text>
          <Text className="mb-2 text-sm leading-relaxed text-gray-700">
            • The company maintains a strict zero-tolerance drug and alcohol
            policy.{"\n"}• Drivers are subject to pre-employment, random,
            post-accident, and reasonable suspicion drug and alcohol testing in
            compliance with DOT regulations.
          </Text>

          <Text className="text-base font-semibold text-[#FFA840] mb-1">
            3.4. Hours of Service (HOS)
          </Text>
          <Text className="mb-2 text-sm leading-relaxed text-gray-700">
            • Drivers must comply with all federal and state HOS regulations.
            {"\n"}• Accurate and complete electronic logging device (ELD)
            records must be maintained.
          </Text>

          <Text className="text-base font-semibold text-[#FFA840] mb-1">
            3.5. Professional Conduct
          </Text>
          <Text className="mb-2 text-sm leading-relaxed text-gray-700">
            • Drivers are expected to maintain a professional demeanor at all
            times.{"\n"}• Drivers must adhere to all traffic laws and
            regulations.
          </Text>
        </View>

        {/* Vehicle Maintenance */}
        <View className="mb-6">
          <Text className="text-xl font-bold text-[#0F2535] mb-3">
            4. Vehicle Maintenance and Safety
          </Text>

          <Text className="text-base font-semibold text-[#FFA840] mb-1">
            4.1. Pre-Trip and Post-Trip Inspections
          </Text>
          <Text className="mb-2 text-sm leading-relaxed text-gray-700">
            • Drivers are required to conduct thorough pre-trip and post-trip
            inspections of their vehicles.{"\n"}• All defects must be reported
            immediately.
          </Text>

          <Text className="text-base font-semibold text-[#FFA840] mb-1">
            4.2. Vehicle Maintenance
          </Text>
          <Text className="mb-2 text-sm leading-relaxed text-gray-700">
            • The company will maintain all vehicles in safe operating
            condition.
            {"\n"}• Drivers must report any vehicle maintenance issues promptly.
          </Text>

          <Text className="text-base font-semibold text-[#FFA840] mb-1">
            4.3. Cargo Securement
          </Text>
          <Text className="mb-2 text-sm leading-relaxed text-gray-700">
            • Drivers are responsible for ensuring that all cargo is properly
            secured in accordance with DOT regulations.
          </Text>

          <Text className="text-base font-semibold text-[#FFA840] mb-1">
            4.4. Accident Reporting
          </Text>
          <Text className="mb-2 text-sm leading-relaxed text-gray-700">
            • In the event of an accident, drivers must follow the company's
            accident reporting procedures.{"\n"}• Drivers must cooperate fully
            with law enforcement and company investigations.
          </Text>
        </View>

        {/* Compliance */}
        <View className="mb-6">
          <Text className="text-xl font-bold text-[#0F2535] mb-3">
            5. Compliance
          </Text>

          <Text className="text-base font-semibold text-[#FFA840] mb-1">
            5.1. Regulatory Compliance
          </Text>
          <Text className="mb-2 text-sm leading-relaxed text-gray-700">
            • The company is committed to complying with all applicable federal,
            state, and local regulations.{"\n"}• Drivers are responsible for
            understanding and adhering to these regulations.
          </Text>

          <Text className="text-base font-semibold text-[#FFA840] mb-1">
            5.2. Record Keeping
          </Text>
          <Text className="text-sm leading-relaxed text-gray-700">
            • Accurate and complete records must be maintained for all aspects
            of operations.
          </Text>
        </View>

        {/* Enforcement */}
        <View className="mb-6">
          <Text className="text-xl font-bold text-[#0F2535] mb-3">
            6. Enforcement
          </Text>
          <Text className="text-sm leading-relaxed text-gray-700">
            Violations of this policy may result in disciplinary action, up to
            and including termination of employment.
          </Text>
        </View>

        {/* Policy Review */}
        <View className="mb-6">
          <Text className="text-xl font-bold text-[#0F2535] mb-3">
            7. Policy Review
          </Text>
          <Text className="text-sm leading-relaxed text-gray-700">
            This policy will be reviewed and updated periodically to ensure
            compliance with changing regulations and industry best practices.
          </Text>
        </View>

        {/* Key Considerations */}
        <View className="mb-10">
          <Text className="text-xl font-bold text-[#0F2535] mb-3">
            Key considerations for a trucking company policy:
          </Text>
          <Text className="text-sm leading-relaxed text-gray-700">
            • DOT regulations: The Federal Motor Carrier Safety Administration
            (FMCSA) has extensive regulations that must be followed.{"\n"}•
            State regulations: Each state may have its own specific trucking
            regulations.{"\n"}• Insurance requirements: Insurance companies
            often have specific requirements for trucking companies.{"\n"}•
            Company specific needs: Cargo type, travel distance, and company
            culture will impact the policy.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PrivacyPolicy;
