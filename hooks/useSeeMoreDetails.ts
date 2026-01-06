import { useState } from "react";

export default function useSeeMoreDetails<T>() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<T | null>(null);

  const handleSeeMorePress = (request: any) => {
    setSelectedRequest(request);
    setModalVisible(true);
  };

  return { modalVisible, setModalVisible, selectedRequest, handleSeeMorePress };
}
