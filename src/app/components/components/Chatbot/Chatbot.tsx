import { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { X, Send, Bot, Minimize2, Maximize2 } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hi! Welcome to Vintage Nepal! How can I help you today?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickReplies = [
    'How do I sell items?',
    'Payment methods',
    'Shipping info',
    'Account verification',
  ];

  const getBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('sell') || lowerMessage.includes('list')) {
      return 'To sell items on Vintage Nepal: 1) Create a seller account, 2) Complete identity verification, 3) Click "Sell Item" and fill in the details. Note: We charge a 10% commission on sales.';
    }

    if (lowerMessage.includes('payment') || lowerMessage.includes('pay')) {
      return 'We accept Cash on Delivery (COD) and digital wallets like eSewa and Khalti. Payment is processed securely through our platform.';
    }

    if (lowerMessage.includes('ship') || lowerMessage.includes('deliver')) {
      return 'Shipping is arranged between buyer and seller. Most sellers offer delivery within Kathmandu Valley. Shipping costs vary by location.';
    }

    if (lowerMessage.includes('verif') || lowerMessage.includes('id')) {
      return 'Seller verification requires uploading a valid ID (Citizenship, Passport, or License) and a selfie. Verification takes 24-48 hours. This ensures trust and safety on our platform.';
    }

    if (lowerMessage.includes('commission') || lowerMessage.includes('fee')) {
      return 'We charge a 10% commission on all successful sales. This helps us maintain the platform and provide customer support.';
    }

    if (lowerMessage.includes('favorite') || lowerMessage.includes('save')) {
      return 'Click the heart icon on any item to add it to your favorites. You can view all your favorite items by clicking the heart icon in the top navigation.';
    }

    if (lowerMessage.includes('cart') || lowerMessage.includes('checkout')) {
      return 'Add items to your cart by clicking "Add to Cart" on the item page. Then proceed to checkout to complete your purchase.';
    }

    if (lowerMessage.includes('account') || lowerMessage.includes('signup') || lowerMessage.includes('register')) {
      return 'You can create an account by clicking "Sign up" in the top right. Choose between Buyer or Seller account types. Sellers need to complete verification before listing items.';
    }

    if (lowerMessage.includes('contact') || lowerMessage.includes('support') || lowerMessage.includes('help')) {
      return 'You can contact our support team at support@vintagenepal.com or call us at 01-1234567. We\'re here to help!';
    }

    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return 'Hello! How can I assist you with Vintage Nepal today?';
    }

    if (lowerMessage.includes('thank')) {
      return 'You\'re welcome! Is there anything else I can help you with?';
    }

    return 'I\'m here to help! You can ask me about selling items, payments, shipping, account verification, or any other questions about Vintage Nepal.';
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot typing
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const botResponse: Message = {
      id: (Date.now() + 1).toString(),
      text: getBotResponse(inputValue),
      sender: 'bot',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, botResponse]);
    setIsTyping(false);
  };

  const handleQuickReply = (reply: string) => {
    setInputValue(reply);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 size-14 bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 flex items-center justify-center z-50 animate-bounce"
      >
        <Bot className="size-6" />
        <span className="absolute -top-1 -right-1 size-4 bg-green-500 rounded-full border-2 border-white" />
      </button>
    );
  }

  return (
    <div
      className={`fixed bottom-6 right-6 bg-white rounded-2xl shadow-2xl flex flex-col z-50 transition-all ${
        isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
      } max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)]`}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-t-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-10 bg-white/20 rounded-full flex items-center justify-center">
            <Bot className="size-6" />
          </div>
          <div>
            <h3 className="font-medium">Vintage Nepal Assistant</h3>
            <p className="text-xs text-white/80">Online</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="hover:bg-white/20 p-1.5 rounded-lg transition"
          >
            {isMinimized ? <Maximize2 className="size-4" /> : <Minimize2 className="size-4" />}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="hover:bg-white/20 p-1.5 rounded-lg transition"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                      : 'bg-neutral-100 text-neutral-800'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.sender === 'user' ? 'text-white/70' : 'text-neutral-500'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-neutral-100 rounded-2xl px-4 py-3">
                  <div className="flex gap-1">
                    <div className="size-2 bg-neutral-400 rounded-full animate-bounce" />
                    <div
                      className="size-2 bg-neutral-400 rounded-full animate-bounce"
                      style={{ animationDelay: '0.1s' }}
                    />
                    <div
                      className="size-2 bg-neutral-400 rounded-full animate-bounce"
                      style={{ animationDelay: '0.2s' }}
                    />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          <div className="px-4 pb-2 flex gap-2 flex-wrap">
            {quickReplies.map((reply) => (
              <button
                key={reply}
                onClick={() => handleQuickReply(reply)}
                className="text-xs bg-neutral-100 hover:bg-neutral-200 px-3 py-1.5 rounded-full transition"
              >
                {reply}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                placeholder="Type your message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
              />
              <Button onClick={handleSendMessage} size="icon" disabled={!inputValue.trim()}>
                <Send className="size-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
