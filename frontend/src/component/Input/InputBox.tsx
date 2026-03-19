import { useState } from "react";
import { Select, Dropdown, Button, Typography } from "antd";
import {
  PaperClipOutlined,
  FileImageOutlined,
  VideoCameraOutlined,
  AudioOutlined,
  FileOutlined,
  EyeOutlined,
  DownloadOutlined,
  DeleteOutlined,
  FilePdfOutlined,
  FileTextOutlined,
  FileWordOutlined,
  FileExcelOutlined,
  FileDoneOutlined,
  ArrowUpOutlined,
  GoogleOutlined,
  StopOutlined,
  CloseOutlined,
} from "@ant-design/icons";
export const InputBox = () => {
  const [queryText, setQueryText] = useState("");

  const { Text } = Typography;
  const [isSending, setIsSending] = useState(false);
  const [agentMode, setAgentMode] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleSendMessage = () => {};
  return (
    <div className="w-full! flex flex-col items-center bg-transparent! justify-center border-gray-100">
      <div className="">
        {/* show event stage dashboard and component generation stages  */}
        <div className=" border p-2 rounded-xl border-gray-200 bg-white drop-shadow-xl mx-auto">
          {/* Attached files preview area */}

          <textarea
            className="w-full  min-h-16 focus:outline-none resize-none placeholder:text-[14px]"
            placeholder="Ask me anything on your data..."
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
              }
            }}
          />
          <div className="flex items-center justify-between space-x-2">
            <div className=" flex">
              <Dropdown
                // menu={{
                //   items: attachmentItems,
                //   onClick: handleAttachmentClick,
                // }}
                placement="bottom"
                trigger={["hover"]}
              >
                <Button className="border-0!" icon={<PaperClipOutlined />} />
              </Dropdown>
              <Select
                value={"Gemini"}
                variant="borderless"
                className="w-[120px]"
                options={[
                  {
                    value: "Gemini",
                    label: "GPT 5.1",
                  },
                  {
                    value: "claude",
                    label: "Claude 4.5",
                  },
                  {
                    value: "Claude.3.5",
                    label: "Claude 3.5",
                  },
                ]}
              />
              <Select
                value={"Agent"}
                variant="borderless"
                className="w-[100px]"
                placeholder="Select Task"
                options={[
                  {
                    value: "Agent",
                    label: <div className="">Agent</div>,
                  },
                  {
                    value: "Ask",
                    label: <div className="">Ask</div>,
                  },
                ]}
              />
              <div className="capitalize border border-gray-100 flex items-center justify-center px-2 rounded bg-gray-100!">
                <Text> {agentMode ? `${agentMode}` : "Ask Luuke"}</Text>
              </div>
            </div>
            <div className="">
              <Button
                type="primary"
                icon={
                  isSending ? (
                    <StopOutlined
                      style={{
                        color: "white",
                      }}
                    />
                  ) : (
                    <ArrowUpOutlined
                      style={{
                        color: "white",
                      }}
                    />
                  )
                }
                className="bg-black!"
                onClick={handleSendMessage}
                loading={isSending}
                disabled={!queryText.trim() && uploadedFiles.length === 0}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
