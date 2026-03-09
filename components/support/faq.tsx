import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export interface Faq {
  id: number;
  question: string;
  answer: string;
}

export interface FaqsTabProps {
  faqs: Faq[];
  searchQuery: string;
  onChangeSearchQuery: (text: string) => void;
  expandedFaqId: number | null;
  onToggleFaq: (id: number) => void;
}

interface FaqItemProps {
  item: Faq;
  isOpen: boolean;
  onToggle: () => void;
}

const FaqItem: React.FC<FaqItemProps> = ({ item, isOpen, onToggle }) => (
  <Pressable
    onPress={onToggle}
    className={`bg-white rounded-2xl overflow-hidden border active:bg-gray-100 ${
      isOpen ? "border-lightPrimary" : "border-gray-100"
    }`}
  >
    <View className="flex-row items-center p-3.5 gap-3">
      <View
        className="w-7 h-7 rounded-lg items-center justify-center"
        style={{ backgroundColor: isOpen ? "#FFA840" : "#FFF7ED" }}
      >
        <Text
          className="text-xs font-bold"
          style={{ color: isOpen ? "#0F2535" : "#ED8718" }}
        >
          Q
        </Text>
      </View>
      <Text className="flex-1 text-sm font-semibold text-secondary leading-5">
        {item.question}
      </Text>
      <Ionicons
        name={isOpen ? "chevron-up" : "chevron-down"}
        size={16}
        color={isOpen ? "#FFA840" : "#9CA3AF"}
      />
    </View>
    {isOpen && (
      <View className="px-3.5 pb-3.5">
        <View className="h-px bg-orange-50 mb-2.5" />
        <Text className="text-sm text-gray-600 leading-6">{item.answer}</Text>
      </View>
    )}
  </Pressable>
);

export default function FAQTab({
  faqs,
  searchQuery,
  onChangeSearchQuery,
  expandedFaqId,
  onToggleFaq,
}: FaqsTabProps) {
  {
    const filtered = faqs.filter((f) =>
      f.question.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    return (
      <View className="gap-3.5">
        <Text className="text-base font-bold text-secondary">
          Frequently Asked Questions
        </Text>

        {/* Search */}
        <View className="flex-row items-center bg-white rounded-2xl px-3.5 py-1 gap-2.5 border border-gray-100">
          <Ionicons name="search-outline" size={17} color="#9CA3AF" />
          <TextInput
            value={searchQuery}
            onChangeText={onChangeSearchQuery}
            placeholder="Search a question..."
            placeholderTextColor="#9CA3AF"
            className="flex-1 text-sm text-secondary"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => onChangeSearchQuery("")}>
              <Ionicons name="close-circle" size={17} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>

        {/* List */}
        {filtered.length > 0 ? (
          filtered.map((faq) => (
            <FaqItem
              key={faq.id}
              item={faq}
              isOpen={expandedFaqId === faq.id}
              onToggle={() => onToggleFaq(faq.id)}
            />
          ))
        ) : (
          <View className="items-center py-10 gap-2.5">
            <Ionicons name="search" size={38} color="#E5E7EB" />
            <Text className="text-sm font-bold text-gray-300">
              No results found
            </Text>
          </View>
        )}
      </View>
    );
  }
}
