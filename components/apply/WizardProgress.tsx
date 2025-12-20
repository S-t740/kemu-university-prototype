import React from 'react';
import { Check } from 'lucide-react';

interface WizardProgressProps {
    currentStep: number;
    steps: { label: string; description?: string }[];
}

const WizardProgress: React.FC<WizardProgressProps> = ({ currentStep, steps }) => {
    return (
        <div className="w-full py-6 px-4">
            {/* Desktop Progress Bar */}
            <div className="hidden md:flex items-center justify-between relative">
                {/* Progress Line */}
                <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 -z-10">
                    <div
                        className="h-full bg-gradient-to-r from-kemu-purple to-kemu-gold transition-all duration-500"
                        style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                    />
                </div>

                {steps.map((step, index) => {
                    const stepNumber = index + 1;
                    const isCompleted = stepNumber < currentStep;
                    const isCurrent = stepNumber === currentStep;

                    return (
                        <div key={index} className="flex flex-col items-center relative">
                            {/* Step Circle */}
                            <div
                                className={`
                  w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm
                  transition-all duration-300 transform
                  ${isCompleted
                                        ? 'bg-gradient-to-br from-kemu-purple to-kemu-gold text-white scale-100'
                                        : isCurrent
                                            ? 'bg-kemu-purple text-white ring-4 ring-kemu-purple/30 scale-110'
                                            : 'bg-white border-2 border-gray-300 text-gray-400'
                                    }
                `}
                            >
                                {isCompleted ? <Check size={20} /> : stepNumber}
                            </div>

                            {/* Step Label */}
                            <span
                                className={`
                  mt-2 text-xs font-medium text-center max-w-[80px]
                  ${isCurrent ? 'text-kemu-purple font-bold' : isCompleted ? 'text-gray-700' : 'text-gray-400'}
                `}
                            >
                                {step.label}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Mobile Progress */}
            <div className="md:hidden">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-kemu-purple">
                        Step {currentStep} of {steps.length}
                    </span>
                    <span className="text-sm text-gray-500">
                        {steps[currentStep - 1]?.label}
                    </span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-kemu-purple to-kemu-gold transition-all duration-500 rounded-full"
                        style={{ width: `${(currentStep / steps.length) * 100}%` }}
                    />
                </div>
            </div>
        </div>
    );
};

export default WizardProgress;
