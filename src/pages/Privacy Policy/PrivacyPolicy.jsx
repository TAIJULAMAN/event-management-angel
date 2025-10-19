import { useEffect, useState } from "react";
import { notification } from "antd";
import JoditComponent from "../../components/JoditComponent";
import { useGetPrivacyQuery, useUpdatePrivacyMutation } from "../../redux/api/privacyApi";

export default function PrivacyPolicy() {
  const [content, setContent] = useState("");
  const { data: privacyPolicy, isLoading, refetch } = useGetPrivacyQuery();
  const [updatePrivacy, { isLoading: isUpdating }] = useUpdatePrivacyMutation();

  useEffect(() => {
    if (privacyPolicy) {
      setContent(privacyPolicy);
    }
  }, [privacyPolicy]);

  const handleSave = async () => {
    try {
      await updatePrivacy(content).unwrap();
      await refetch();
      notification.success({
        message: "Success",
        description: "Privacy policy updated successfully!",
        placement: "topRight",
      });
    } catch (error) {
      console.error("Failed to update privacy policy:", error);
      notification.error({
        message: "Error",
        description: error?.data?.message || "Failed to update privacy policy",
        placement: "topRight",
      });
    }
  };

  if (isLoading) {
    return <div className="p-5">Loading privacy policy...</div>;
  }

  return (
    <div className="p-5">
      <h1 className="text-start text-3xl font-bold mb-5">Privacy Policy</h1>

      <div className="bg-white rounded shadow p-5 h-full">
        <JoditComponent 
          content={content} 
          setContent={setContent} 
        />
      </div>
      <div className="text-center py-5 w-full">
        <button
          onClick={handleSave}
          disabled={isUpdating}
          className="bg-[#00c0b5] hover:bg-[#00a89e] text-white font-semibold w-full py-2 rounded transition duration-200 disabled:opacity-70"
        >
          {isUpdating ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}


