import React, { useState, useCallback } from 'react';
import { RoughBox } from './ui/RoughBox';
import { Upload, AlertCircle } from 'lucide-react';
import type { Question } from '@/types/quiz';
import { cn } from '@/lib/utils';

interface QuestionUploadModalProps {
  onUpload: (questions: Question[]) => void;
}

export const QuestionUploadModal: React.FC<QuestionUploadModalProps> = ({ onUpload }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const validateQuestions = (data: any): data is Question[] => {
        if (!Array.isArray(data)) return false;
        return data.every(q => 
            typeof q.question === 'string' &&
            Array.isArray(q.answers) &&
            q.answers.every((a: any) => typeof a.text === 'string' && typeof a.isCorrect === 'boolean')
        );
    };

    const handleFiles = async (files: FileList) => {
        setError(null);
        const allQuestions: Question[] = [];

        try {
            for (let i = 0; i < files.length; i++) {
                const file = files.item(i);
                if (!file) continue;
                
                // Check if it's JSON
                if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
                    throw new Error(`File ${file.name} is not a JSON file.`);
                }

                const text = await file.text();
                let data;
                try {
                    data = JSON.parse(text);
                } catch (e) {
                    throw new Error(`File ${file.name} is not a valid JSON.`);
                }

                if (!validateQuestions(data)) {
                    throw new Error(`File ${file.name} has an invalid quiz structure.`);
                }

                allQuestions.push(...data);
            }

            if (allQuestions.length === 0) {
                throw new Error("No questions found in the uploaded files.");
            }

            onUpload(allQuestions);
        } catch (err: any) {
            setError(err.message || "An error occurred while processing files.");
        }
    };

    const onDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFiles(e.dataTransfer.files);
        }
    }, []);

    const onDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const onDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFiles(e.target.files);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
            <RoughBox 
                className="w-full max-w-lg p-8 bg-background shadow-2xl animate-in zoom-in-95 duration-300"
                roughness={1}
                strokeWidth={2}
                cornerRadius={12}
                shape="rounded"
            >
                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-3xl font-bold font-hand text-center w-full">Upload Quiz Questions</h2>
                    </div>

                    <p className="mb-6 text-muted-foreground text-center">
                        Please upload one or more JSON files to start the quiz.
                    </p>

                    <div
                        onDrop={onDrop}
                        onDragOver={onDragOver}
                        onDragLeave={onDragLeave}
                        className={cn(
                            "relative group cursor-pointer transition-all duration-300",
                            isDragging ? "scale-[1.02]" : ""
                        )}
                        onClick={() => document.getElementById('fileInput')?.click()}
                    >
                        <RoughBox
                            className={cn(
                                "flex flex-col items-center justify-center py-12 px-4 transition-colors",
                                isDragging ? "bg-accent/50" : "bg-accent/10 hover:bg-accent/20"
                            )}
                            roughness={2}
                            strokeWidth={2}
                            strokeLineDash={isDragging ? [8, 8] : undefined}
                            fillStyle="hachure"
                            fill={isDragging ? "currentColor" : "transparent"}
                            fillWeight={0.5}
                            hachureGap={10}
                        >
                            <Upload className={cn(
                                "w-12 h-12 mb-4 transition-transform duration-300",
                                isDragging ? "scale-110 -translate-y-1" : "group-hover:-translate-y-1"
                            )} />
                            <p className="text-lg font-medium mb-2">Drop your files here</p>
                            <p className="text-sm text-muted-foreground">or click to browse</p>
                            <input
                                id="fileInput"
                                type="file"
                                multiple
                                accept=".json,application/json"
                                className="hidden"
                                onChange={onFileInputChange}
                            />
                        </RoughBox>
                    </div>

                    {error && (
                        <div className="mt-4 p-4 flex items-start gap-3 text-destructive animate-in fade-in slide-in-from-top-2 bg-destructive/10 rounded-lg">
                            <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
                            <p className="text-sm font-medium">{error}</p>
                        </div>
                    )}
                </div>
            </RoughBox>
        </div>
    );
};
