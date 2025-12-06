import React, { useState, useEffect } from "react";
import { ArrowLeft, RefreshCw, Check } from "lucide-react";

interface SituationAIProps {
  onComplete: () => void;
  onBack: () => void;
  surveyId: string;  
}

export default function SituationAI({ onComplete, onBack }: SituationAIProps) {
  const [situation, setSituation] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");

  // Hàm mô phỏng gọi AI để tạo tình huống ngẫu nhiên
  const generateSituation = async () => {
    const examples = [
      "Nhóm bạn của bạn rủ đi trốn học để chơi game. Bạn sẽ làm gì?",
      "Một người bạn trong nhóm bị mọi người cô lập vì ý kiến khác biệt. Bạn sẽ phản ứng ra sao?",
      "Bạn thấy bạn mình gian lận trong bài kiểm tra và được cả nhóm ủng hộ. Bạn có làm theo không?",
    ];
    const random = examples[Math.floor(Math.random() * examples.length)];
    setSituation(random);
  };

  // Gọi hàm generateSituation khi component mount
  useEffect(() => {
    generateSituation();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Quay lại khảo sát
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
            Giải Quyết Tình Huống
          </h2>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg mb-6">
            <p className="text-gray-700 whitespace-pre-line">{situation}</p>
          </div>

          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Nhập cách giải quyết của bạn..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 min-h-[150px]"
          />

          <div className="flex justify-between mt-8">
            <button
              onClick={generateSituation}
              className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
            >
              <RefreshCw className="w-5 h-5" />
              Tình huống khác
            </button>

            <button
              onClick={onComplete}
              disabled={!answer.trim()}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50"
            >
              <Check className="w-5 h-5" />
              Xem kết quả
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
