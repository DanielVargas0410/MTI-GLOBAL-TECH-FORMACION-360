"use client"
import React, { FC, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bot, Send, X, MessageCircle, Loader2 } from "lucide-react"
import { useChatbot } from "@/hooks/useChatbot"

const Chatbot: FC = () => {
    const [isOpen, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const { messages, isLoading, processMessage } = useChatbot();

    const handleSend = async () => {
        if (message.trim() && !isLoading) {
            const messageToSend = message.trim();
            setMessage("");
            await processMessage(messageToSend);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-40">
            {isOpen && (
                <Card className="w-80 h-96 mb-4 shadow-2xl border dark:border-slate-700 animate-fade-in-up bg-card">
                    <CardHeader className="bg-slate-100 dark:bg-slate-800 text-foreground rounded-t-lg">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2"><Bot className="w-5 h-5 text-primary" /><CardTitle className="text-sm">Asistente IA Formación 360</CardTitle></div>
                            <Button variant="ghost" size="sm" onClick={() => setOpen(false)} className="text-muted-foreground hover:bg-muted h-6 w-6 p-0"><X className="w-4 h-4" /></Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-4 flex flex-col h-[calc(24rem-4rem)]">
                        <div className="flex-1 bg-muted/50 dark:bg-slate-800/50 rounded-lg p-3 mb-3 overflow-y-auto space-y-3">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] p-3 rounded-lg text-sm whitespace-pre-wrap ${
                                            msg.isUser
                                                ? 'bg-primary text-primary-foreground'
                                                : 'bg-background border'
                                        }`}
                                    >
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-background border p-3 rounded-lg">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <Input
                                type="text"
                                placeholder="Pregunta sobre cursos, precios, módulos..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                disabled={isLoading}
                                className="flex-1"
                            />
                            <Button
                                onClick={handleSend}
                                size="sm"
                                disabled={!message.trim() || isLoading}
                            >
                                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
             <Button onClick={() => setOpen(!isOpen)} className="w-14 h-14 rounded-full bg-primary hover:bg-primary/90 shadow-2xl transition-all duration-300 hover:scale-110">
                <MessageCircle className="w-6 h-6" />
            </Button>
        </div>
    );
};

export default Chatbot;
