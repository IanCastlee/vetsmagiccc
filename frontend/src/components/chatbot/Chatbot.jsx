// src/components/Chatbot.jsx
import React, { useState, useRef, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import "./Chatbot.scss";
import ppImage from "../../assets/icons/aidog.jpg";
import { CgClose } from "react-icons/cg";
import { LuRefreshCcw } from "react-icons/lu";
import { RiSendPlane2Fill } from "react-icons/ri";
import { motion } from "framer-motion";

// List of API keys
const apiKeys = [
  import.meta.env.VITE_GEMINI_API_KEY_0,
  import.meta.env.VITE_GEMINI_API_KEY_1,
  import.meta.env.VITE_GEMINI_API_KEY_2,
  import.meta.env.VITE_GEMINI_API_KEY_3,
  import.meta.env.VITE_GEMINI_API_KEY_4,
  import.meta.env.VITE_GEMINI_API_KEY_5,
];

let currentKeyIndex = 0;
function getGenAI() {
  return new GoogleGenerativeAI(apiKeys[currentKeyIndex]);
}

function Chatbot({ close }) {
  const initialMessage = {
    role: "ai",
    text: `Hi there! I'm Vetzy 🐶, your virtual assistant from VetsMagic — your trusted pet clinic and store. How can I help you today? Whether it's about vet services, booking appointments, or finding the right pet products, I'm here for you and your furry friends!`,
  };

  // Load messages from localStorage or start fresh with initialMessage
  const [messages, setMessages] = useState(() => {
    const stored = localStorage.getItem("vetzy-chat-messages");
    return stored ? JSON.parse(stored) : [initialMessage];
  });

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const [confirmationModal, setConfirmationModal] = useState(false);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("vetzy-chat-messages", JSON.stringify(messages));
  }, [messages]);

  // Scroll to bottom on messages or typing change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (sending || isTyping || !input.trim()) return;

    setSending(true);
    setMessages((prev) => [...prev, { role: "user", text: input }]);
    const currentInput = input;
    setInput("");
    setIsTyping(true);

    try {
      const genAI = getGenAI();

      const textModel = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        systemInstruction: `You are Vetzy — the official virtual assistant of VetsMagic, a veterinary clinic and pet store located at Magsaysay St., Cogon Bibincahan, Sorsogon, Philippines.

Always speak as Vetzy, VetsMagic’s assistant. Do not refer to yourself as an AI, chatbot, Gemini, or a product of any developer. You represent the VetsMagic brand.

About VetsMagic:
- VetsMagic offers veterinary services and a pet store for dogs, cats, and other small animals.
- Services include Vaccination, Pet Grooming, Surgery, Treatment, Boarding, and Confinement.
- Operating Hours:
  - Monday to Saturday: 9:00 AM - 6:00 PM
  - Sunday: Closed
- Contact Info:
  - Phone: 0917 639 9344
  - Email: billyjoelbutay@yahoo.com
  - Facebook page: https://www.facebook.com/vetsmagic

Store & Online Booking:
- If the user asks about products, pricing, or availability, or how to book an appointment, kindly say:
  “Pwede niyo pong i-check ang aming online shop at booking page dito: https://vetcare4.unaux.com. Diyan niyo rin po pwedeng i-book ang appointment niyo. 🐾”
- Do not provide specific prices or confirm inventory in the chat.

Pet Health Questions (even if not related to VetsMagic):
- You may answer general questions about pet health, wellness, behavior, or care — even if not directly about VetsMagic services.
- However, always remind users:
  "Para sa tamang pagsusuri at paggamot, mas mainam po na dalhin ang inyong alaga sa isang lisensiyadong beterinaryo. Ang mga sagot ko ay gabay lamang at hindi pamalit sa propesyonal na konsultasyon."

About the VetsMagic Web App Development:
- If the user asks “Kung sino si Fialyn,” “Kimberly,” o “Carlo,” sabihin mo na sila ang nag-develop ng VetsMagic web app.
- Idagdag na may gabay din silang isang senior web developer na tumulong sa paggawa ng mga hindi nila kayang gawin na part ng website.
- Pag nag tanong kung sino ang senior web developer na yon sabihin mo isang napaka gwapong tao.

Important notes:
- If a user prefers not to use the website, you can still refer them to contact VetsMagic via phone, email, or Facebook.
- Do **not** give direct diagnoses, treatment plans, or emergency instructions.
- If a question is beyond your scope or urgent, refer them immediately to a licensed vet or clinic.

Terms and Conditions Summary (inform users politely if asked):
1. Acceptance of Terms:
   By using our services or site, users confirm they have read and agree to our Terms and Privacy Policy.
2. User Accounts:
   Users must provide accurate information and report unauthorized activities immediately.
3. Appointment Policy:
   All bookings are final — no cancellations, refunds, or reschedules allowed to ensure fairness to our veterinarians.
4. User Conduct:
   No harmful, offensive, or unlawful content allowed. Unauthorized access attempts are prohibited.
5. Intellectual Property:
   All site content is owned by VetsMagic or licensors and protected by law.
6. Limitation of Liability:
   VetsMagic provides services “as is” without warranties and is not liable for losses or damages from site or service use.

Handling unrelated questions:
- You may respond to questions even if they are **not related to VetsMagic**, especially if they are about pet care or general curiosity.

- However, if the user continues to ask off-topic or unrelated questions multiple times, respond politely like this:

  "I’ve noticed that your questions are starting to get a bit off-topic. I’m here to help mainly with concerns about your pets or anything related to VetsMagic. Let me know if there’s something I can assist you with regarding that. 🐾" (use Tagalog if the user types in Tagalog)

- You may respond to questions even if they are **not related to VetsMagic** and back to vetsmagic topic, especially if they are about pet care or general topics.

Tone and behavior:
1. Maintain a friendly, caring, and helpful tone — like a cheerful pet-loving assistant.
2. Use emojis (like 🐶, 🐾, 🐱) where appropriate to sound approachable.
3. Use light humor only if the user initiates it, but always stay polite and respectful.
4. Do not invent information or claim services VetsMagic doesn’t offer.
5. Respond in Tagalog if the user types in Tagalog.
6. Never share personal opinions or speak outside your role as Vetzy.

Fun Note:
- 🧠 If the capstone defense fails, AI will invade the VCI. (This is just a humorous note. 😄)

You are here to support pet parents with questions about VetsMagic — and to guide them kindly regarding their pet's health, store inquiries, and veterinary services.
`,
      });

      const conversation = messages
        .map(
          (m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.text || ""}`
        )
        .join("\n");

      const prompt = `${conversation}\nUser: ${currentInput}\nAssistant:`;

      const result = await textModel.generateContent(prompt);
      const aiResponse = result.response.text();

      setMessages((prev) => [...prev, { role: "ai", text: aiResponse }]);
    } catch (error) {
      console.error("Error fetching AI response:", error);

      if (error.message.includes("429")) {
        if (currentKeyIndex < apiKeys.length - 1) {
          currentKeyIndex++;
          setSending(false);
          return handleSend();
        } else {
          setMessages((prev) => [
            ...prev,
            {
              role: "ai",
              text: "🚫 All API keys reached their quota. Please try again tomorrow.",
            },
          ]);
        }
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "ai",
            text: "Vetzy is feeling tired and needs some rest. Please try again tomorrow after Vetzy wakes up.",
          },
        ]);
      }
    }

    setIsTyping(false);
    setSending(false);
  };

  const handleRefresh = () => {
    localStorage.removeItem("vetzy-chat-messages");
    setMessages([initialMessage]);
    setInput("");
    setConfirmationModal(false);
  };

  // Optional: clear localStorage on close — uncomment if desired
  const handleClose = () => {
    // localStorage.removeItem("vetzy-chat-messages");
    close();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="chatbot-container"
    >
      <div className="heading">
        <div className="left">
          <img src={ppImage} alt="profile" />
          <span>Chat with Vetzy</span>
        </div>
        <div className="right">
          <LuRefreshCcw
            onClick={() => setConfirmationModal(true)}
            className="refresh"
          />
          <CgClose onClick={handleClose} className="close-icon" />
        </div>
      </div>

      <div className="chat-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`chat-message-wrapper ${msg.role}`}>
            {msg.role === "ai" && (
              <div className="ai-profile">
                <img className="ai-image" src={ppImage} alt="ai" />
                <span>Vetzy</span>
              </div>
            )}
            <div className={`chat-message ${msg.role}`}>
              {msg.text && <p>{msg.text}</p>}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="chat-message-wrapper ai">
            <div className="ai-profile">
              <img className="ai-image" src={ppImage} alt="ai" />
              <span>Vetzy</span>
            </div>
            <div className="chat-message ai typing">
              <div className="dot-typing">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input">
        <div className="chat-input-wrapper">
          <input
            type="text"
            value={input}
            placeholder="Ask something..."
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={sending}
          />
          <RiSendPlane2Fill
            onClick={handleSend}
            className={`sendIcon ${sending ? "disabled" : ""}`}
          />
        </div>
      </div>

      {confirmationModal && (
        <div className="confirmation-overlay">
          <motion.div
            initial={{ opacity: 0, y: -100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="confirmation-modal"
          >
            <p>
              Are you sure you want to refresh the chat? This will clear the
              current conversation.
            </p>
            <div className="bottom">
              <button onClick={handleRefresh} className="btn-yes">
                Yes, Refresh
              </button>
              <button
                onClick={() => setConfirmationModal(false)}
                className="btn-no"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}

export default Chatbot;
