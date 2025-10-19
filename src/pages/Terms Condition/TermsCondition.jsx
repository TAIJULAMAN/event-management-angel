import { useEffect, useState } from "react";
import JoditComponent from "../../components/JoditComponent";
import { 
  useGetTermsAndConditionsQuery, 
  useUpdateTermsAndConditionsMutation 
} from "../../redux/api/termsApi";
import { message } from "antd";

const TermsCondition = () => {
  const [content, setContent] = useState("");
  const { data, isLoading } = useGetTermsAndConditionsQuery();
  const [updateTerms, { isLoading: isSubmitting }] = useUpdateTermsAndConditionsMutation();

  const handleSubmit = async () => {
    if (!content) {
      message.error("Terms & Conditions content cannot be empty!");
      return;
    }

    const requestData = {
      TermsConditions: content,
    };

    try {
      const res = await updateTerms({ requestData }).unwrap();
      console.log("Response from updateTerms:", res);

      if (res?.success) {
        message.success(res?.message || "Terms & Conditions updated successfully!");
      }
    } catch (error) {
      message.error(error?.data?.message || "Something went wrong!");
      console.error(error);
    }
  };

  useEffect(() => {
    if (data?.data?.TermsConditions) {
      setContent(data.data.TermsConditions);
    }
  }, [data]);

  if (isLoading) return <>loading...</>;

  return (
    <div className="p-5">
        <h1 className="text-start text-3xl font-bold mb-5">Terms & Conditions</h1>
      <div className="bg-white rounded shadow p-5 h-full mb-5">
        <JoditComponent setContent={setContent} content={content} />
      </div>
      <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="bg-[#00c0b5] hover:bg-[#00a89e] text-white font-semibold w-full py-2 rounded transition duration-200 disabled:opacity-70"
        >
          {isSubmitting ? "Saving..." : "Save Changes"}
        </button>
    </div>
  );
};

export default TermsCondition;
