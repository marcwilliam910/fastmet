import {useState} from "react";

export default function useSeeMoreDetails() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const handleSeeMorePress = (request: any) => {
    setSelectedRequest(request);
    setModalVisible(true);
  };

  return {modalVisible, setModalVisible, selectedRequest, handleSeeMorePress};
}
