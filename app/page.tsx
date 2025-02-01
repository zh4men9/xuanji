'use client';

import { DivinationForm } from '@/components/divination/DivinationForm';
import { DivinationResult } from '@/components/divination/DivinationResult';
import { ConversationHistory } from '@/components/divination/ConversationHistory';
import { ModelSelector } from '@/components/ModelSelector';
import { useDivinationStore } from '@/lib/divination';

export default function Home() {
  const { currentResponse, clearHistory, history, selectedModel, setSelectedModel } = useDivinationStore();

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col items-center space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
            玄机
          </h1>
          <p className="text-xl text-white/90">
            AI 智能算命系统
          </p>
        </div>

        <div className="w-full max-w-4xl bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-xl">
          <div className="flex flex-col space-y-6">
            <ConversationHistory />
            <ModelSelector
              value={selectedModel}
              onChange={setSelectedModel}
            />
            
            <div className="sticky bottom-0 bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-lg">
              {!currentResponse ? <DivinationForm /> : <DivinationResult />}
              
              {history.length > 0 && (
                <div className="flex justify-end mt-4">
                  <button
                    onClick={clearHistory}
                    className="px-4 py-2 text-sm text-white/80 hover:text-white transition-colors"
                  >
                    清除对话历史
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}