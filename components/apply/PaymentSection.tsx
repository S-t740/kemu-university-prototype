import React, { useState } from 'react';
import { CreditCard, Smartphone, Building2, CheckCircle2, Loader2, AlertCircle, Copy } from 'lucide-react';
import { StudentApplicationFormData } from '../../types';
import { initiateMpesaPayment, verifyMpesaPayment } from '../../services/api';

interface PaymentSectionProps {
    formData: StudentApplicationFormData;
    updateFormData: (data: Partial<StudentApplicationFormData>) => void;
    errors: Record<string, string>;
    applicationId?: string;
}

const APPLICATION_FEE = 1000; // KES

const PaymentSection: React.FC<PaymentSectionProps> = ({
    formData,
    updateFormData,
    errors,
    applicationId
}) => {
    const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'bank' | null>(null);
    const [stkPushLoading, setStkPushLoading] = useState(false);
    const [stkPushSuccess, setStkPushSuccess] = useState(false);
    const [stkInstructions, setStkInstructions] = useState<string[]>([]);
    const [checkoutRequestId, setCheckoutRequestId] = useState<string | null>(null);
    const [verifyLoading, setVerifyLoading] = useState(false);
    const [paymentVerified, setPaymentVerified] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [receiptInput, setReceiptInput] = useState('');

    const initiateStkPush = async () => {
        if (!formData.phone || !applicationId) {
            setError('Phone number and application are required');
            return;
        }

        setStkPushLoading(true);
        setError(null);

        try {
            const phone = `${formData.phoneCode}${formData.phone}`.replace(/\+/g, '');
            const result = await initiateMpesaPayment(phone, APPLICATION_FEE, applicationId);

            if (result.success) {
                setStkPushSuccess(true);
                setCheckoutRequestId(result.checkoutRequestId);
                if (result.instructions) {
                    setStkInstructions(result.instructions);
                }
                updateFormData({ paymentMethod: 'MPESA' });
            }
        } catch (err) {
            setError('Failed to initiate M-PESA payment. Please try again.');
        } finally {
            setStkPushLoading(false);
        }
    };

    const verifyPayment = async () => {
        if (!receiptInput || !applicationId) {
            setError('Please enter the M-PESA receipt number');
            return;
        }

        setVerifyLoading(true);
        setError(null);

        try {
            const result = await verifyMpesaPayment(applicationId, receiptInput, checkoutRequestId || undefined);

            if (result.success) {
                setPaymentVerified(true);
                updateFormData({
                    paymentReference: receiptInput,
                    mpesaReceiptNumber: receiptInput
                });
            }
        } catch (err: any) {
            setError(err.message || 'Failed to verify payment. Please check the receipt number.');
        } finally {
            setVerifyLoading(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    return (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-serif font-bold text-gray-800">Application Fee Payment</h2>
                <p className="text-gray-500 mt-2">Pay the application fee to complete your submission</p>
            </div>

            {/* Fee Summary */}
            <div className="bg-gradient-to-br from-kemu-purple to-kemu-gold p-6 rounded-2xl text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-white/80 text-sm">Application Fee</p>
                        <p className="text-3xl font-bold mt-1">KES {APPLICATION_FEE.toLocaleString()}</p>
                    </div>
                    <CreditCard size={48} className="text-white/50" />
                </div>
            </div>

            {paymentVerified ? (
                <div className="bg-green-50 border-2 border-green-300 rounded-2xl p-6 text-center">
                    <CheckCircle2 size={48} className="text-green-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-green-800">Payment Verified!</h3>
                    <p className="text-green-600 mt-2">Your payment has been confirmed.</p>
                    <p className="text-sm text-gray-600 mt-2">Receipt: {receiptInput}</p>
                </div>
            ) : (
                <>
                    {/* Payment Method Selection */}
                    <div className="grid md:grid-cols-2 gap-4">
                        <button
                            type="button"
                            onClick={() => setPaymentMethod('mpesa')}
                            className={`
                p-6 rounded-xl border-2 transition-all duration-300 text-left
                ${paymentMethod === 'mpesa'
                                    ? 'border-green-500 bg-green-50'
                                    : 'border-gray-200 hover:border-green-300'
                                }
              `}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`p-3 rounded-xl ${paymentMethod === 'mpesa' ? 'bg-green-100' : 'bg-gray-100'}`}>
                                    <Smartphone size={24} className={paymentMethod === 'mpesa' ? 'text-green-600' : 'text-gray-600'} />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-800">M-PESA</p>
                                    <p className="text-sm text-gray-500">Pay via STK Push</p>
                                </div>
                            </div>
                        </button>

                        <button
                            type="button"
                            onClick={() => setPaymentMethod('bank')}
                            className={`
                p-6 rounded-xl border-2 transition-all duration-300 text-left
                ${paymentMethod === 'bank'
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 hover:border-blue-300'
                                }
              `}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`p-3 rounded-xl ${paymentMethod === 'bank' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                                    <Building2 size={24} className={paymentMethod === 'bank' ? 'text-blue-600' : 'text-gray-600'} />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-800">Bank Transfer</p>
                                    <p className="text-sm text-gray-500">Pay via bank deposit</p>
                                </div>
                            </div>
                        </button>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
                            <AlertCircle className="text-red-600" size={20} />
                            <span className="text-red-800">{error}</span>
                        </div>
                    )}

                    {/* M-PESA Payment Flow */}
                    {paymentMethod === 'mpesa' && (
                        <div className="bg-green-50 border border-green-200 rounded-xl p-6 space-y-4">
                            {!stkPushSuccess ? (
                                <>
                                    <p className="text-gray-700">
                                        Click the button below to receive an M-PESA prompt on your phone
                                        <strong> ({formData.phoneCode} {formData.phone})</strong>
                                    </p>
                                    <button
                                        type="button"
                                        onClick={initiateStkPush}
                                        disabled={stkPushLoading}
                                        className="w-full py-4 bg-green-600 text-white rounded-xl font-bold
                      hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {stkPushLoading ? (
                                            <>
                                                <Loader2 size={20} className="animate-spin" />
                                                Sending request...
                                            </>
                                        ) : (
                                            <>
                                                <Smartphone size={20} />
                                                Pay KES {APPLICATION_FEE.toLocaleString()} via M-PESA
                                            </>
                                        )}
                                    </button>
                                </>
                            ) : (
                                <>
                                    <div className="bg-white rounded-lg p-4">
                                        <h4 className="font-bold text-green-800 mb-2">STK Push Sent!</h4>
                                        {stkInstructions.length > 0 && (
                                            <ul className="text-sm text-gray-600 space-y-1">
                                                {stkInstructions.map((instruction, i) => (
                                                    <li key={i}>• {instruction}</li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Enter M-PESA Receipt Number
                                        </label>
                                        <input
                                            type="text"
                                            value={receiptInput}
                                            onChange={(e) => setReceiptInput(e.target.value.toUpperCase())}
                                            placeholder="e.g., QJK7H5M2F9"
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 
                        focus:border-green-500 focus:outline-none focus:ring-4 focus:ring-green-200"
                                        />
                                    </div>

                                    <button
                                        type="button"
                                        onClick={verifyPayment}
                                        disabled={verifyLoading || !receiptInput}
                                        className="w-full py-3 bg-green-600 text-white rounded-xl font-bold
                      hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {verifyLoading ? (
                                            <>
                                                <Loader2 size={20} className="animate-spin" />
                                                Verifying...
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle2 size={20} />
                                                Verify Payment
                                            </>
                                        )}
                                    </button>
                                </>
                            )}
                        </div>
                    )}

                    {/* Bank Transfer Instructions */}
                    {paymentMethod === 'bank' && (
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 space-y-4">
                            <h4 className="font-bold text-blue-800">Bank Transfer Details</h4>

                            <div className="bg-white rounded-lg p-4 space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Bank Name:</span>
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold">Kenya Commercial Bank (KCB)</span>
                                        <button onClick={() => copyToClipboard('Kenya Commercial Bank')} className="p-1 hover:bg-gray-100 rounded">
                                            <Copy size={14} className="text-gray-500" />
                                        </button>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Account Name:</span>
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold">KeMU Applications</span>
                                        <button onClick={() => copyToClipboard('KeMU Applications')} className="p-1 hover:bg-gray-100 rounded">
                                            <Copy size={14} className="text-gray-500" />
                                        </button>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Account Number:</span>
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold">1234567890</span>
                                        <button onClick={() => copyToClipboard('1234567890')} className="p-1 hover:bg-gray-100 rounded">
                                            <Copy size={14} className="text-gray-500" />
                                        </button>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Branch:</span>
                                    <span className="font-semibold">Meru Branch</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Enter Bank Reference / Receipt Number
                                </label>
                                <input
                                    type="text"
                                    value={formData.paymentReference || ''}
                                    onChange={(e) => updateFormData({
                                        paymentReference: e.target.value,
                                        paymentMethod: 'Bank'
                                    })}
                                    placeholder="Enter your bank payment reference"
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 
                    focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-200"
                                />
                            </div>

                            <p className="text-sm text-gray-600">
                                <strong>Note:</strong> Use your application ID as the payment reference when making the deposit.
                            </p>
                        </div>
                    )}
                </>
            )}

            {errors.payment && <p className="text-red-500 text-sm">{errors.payment}</p>}
        </div>
    );
};

export default PaymentSection;
