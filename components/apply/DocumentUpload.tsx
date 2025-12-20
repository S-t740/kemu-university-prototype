import React, { useRef, useState } from 'react';
import { Upload, Camera, FileText, X, Image, CheckCircle2, AlertCircle } from 'lucide-react';
import { StudentApplicationFormData } from '../../types';
import { uploadStudentDocuments } from '../../services/api';

interface DocumentUploadProps {
    formData: StudentApplicationFormData;
    updateFormData: (data: Partial<StudentApplicationFormData>) => void;
    errors: Record<string, string>;
}

interface FilePreview {
    name: string;
    url: string;
    type: string;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({ formData, updateFormData, errors }) => {
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [previews, setPreviews] = useState<Record<string, FilePreview[]>>({});

    const passportPhotoRef = useRef<HTMLInputElement>(null);
    const nationalIdRef = useRef<HTMLInputElement>(null);
    const academicCertsRef = useRef<HTMLInputElement>(null);
    const supportingDocsRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = async (
        files: FileList | null,
        fieldName: 'passportPhoto' | 'nationalIdDoc' | 'academicCerts' | 'supportingDocs',
        multiple: boolean = false
    ) => {
        if (!files || files.length === 0) return;

        setUploading(true);
        setUploadError(null);

        try {
            const formDataUpload = new FormData();
            Array.from(files).forEach((file: File) => {
                formDataUpload.append(fieldName, file);
            });

            const result = await uploadStudentDocuments(formDataUpload);

            if (result.success && result.files[fieldName]) {
                const uploadedPath = result.files[fieldName];

                if (multiple) {
                    const existing = formData[fieldName] as string[] || [];
                    const newPaths = Array.isArray(uploadedPath) ? uploadedPath : [uploadedPath];
                    updateFormData({ [fieldName]: [...existing, ...newPaths] });
                } else {
                    updateFormData({ [fieldName]: Array.isArray(uploadedPath) ? uploadedPath[0] : uploadedPath });
                }

                // Create previews
                const newPreviews: FilePreview[] = Array.from(files).map((file: File, index: number) => ({
                    name: file.name,
                    url: URL.createObjectURL(file),
                    type: file.type
                }));

                setPreviews(prev => ({
                    ...prev,
                    [fieldName]: multiple
                        ? [...(prev[fieldName] || []), ...newPreviews]
                        : newPreviews
                }));
            }
        } catch (error) {
            setUploadError('Failed to upload file. Please try again.');
            console.error('Upload error:', error);
        } finally {
            setUploading(false);
        }
    };

    const removeFile = (fieldName: string, index: number) => {
        const currentPreviews = previews[fieldName] || [];
        const newPreviews = currentPreviews.filter((_, i) => i !== index);
        setPreviews(prev => ({ ...prev, [fieldName]: newPreviews }));

        if (fieldName === 'academicCerts' || fieldName === 'supportingDocs') {
            const currentPaths = (formData[fieldName as keyof StudentApplicationFormData] as string[]) || [];
            updateFormData({ [fieldName]: currentPaths.filter((_, i) => i !== index) });
        } else {
            updateFormData({ [fieldName]: undefined });
        }
    };

    const UploadBox: React.FC<{
        title: string;
        description: string;
        fieldName: 'passportPhoto' | 'nationalIdDoc' | 'academicCerts' | 'supportingDocs';
        accept: string;
        multiple?: boolean;
        required?: boolean;
        icon: React.ReactNode;
        inputRef: React.RefObject<HTMLInputElement>;
    }> = ({ title, description, fieldName, accept, multiple = false, required = false, icon, inputRef }) => {
        const fieldPreviews = previews[fieldName] || [];
        const hasFile = fieldPreviews.length > 0 || formData[fieldName];

        return (
            <div className={`
        border-2 border-dashed rounded-xl p-6 transition-all duration-300
        ${errors[fieldName]
                    ? 'border-red-300 bg-red-50'
                    : hasFile
                        ? 'border-green-300 bg-green-50'
                        : 'border-gray-300 hover:border-kemu-purple hover:bg-kemu-purple/5'
                }
      `}>
                <div className="flex items-start gap-4">
                    <div className={`
            p-3 rounded-xl
            ${hasFile ? 'bg-green-100 text-green-600' : 'bg-kemu-purple/10 text-kemu-purple'}
          `}>
                        {hasFile ? <CheckCircle2 size={24} /> : icon}
                    </div>

                    <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">
                            {title} {required && <span className="text-red-500">*</span>}
                        </h4>
                        <p className="text-sm text-gray-500 mt-1">{description}</p>

                        {/* Previews */}
                        {fieldPreviews.length > 0 && (
                            <div className="mt-3 space-y-2">
                                {fieldPreviews.map((preview, index) => (
                                    <div key={index} className="flex items-center gap-2 bg-white p-2 rounded-lg">
                                        {preview.type.startsWith('image/') ? (
                                            <img src={preview.url} alt={preview.name} className="w-10 h-10 object-cover rounded" />
                                        ) : (
                                            <FileText size={24} className="text-gray-500" />
                                        )}
                                        <span className="text-sm text-gray-600 flex-1 truncate">{preview.name}</span>
                                        <button
                                            type="button"
                                            onClick={() => removeFile(fieldName, index)}
                                            className="p-1 text-red-500 hover:bg-red-100 rounded"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <input
                            ref={inputRef}
                            type="file"
                            accept={accept}
                            multiple={multiple}
                            className="hidden"
                            onChange={(e) => handleFileUpload(e.target.files, fieldName, multiple)}
                        />

                        <div className="mt-4 flex flex-wrap gap-2">
                            <button
                                type="button"
                                onClick={() => inputRef.current?.click()}
                                disabled={uploading}
                                className="px-4 py-2 bg-kemu-purple text-white rounded-lg text-sm font-medium
                  hover:bg-kemu-purple/90 transition-colors disabled:opacity-50 flex items-center gap-2"
                            >
                                <Upload size={16} />
                                {hasFile ? (multiple ? 'Add More' : 'Replace') : 'Upload'}
                            </button>
                            <button
                                type="button"
                                onClick={() => inputRef.current?.click()}
                                disabled={uploading}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium
                  hover:bg-gray-50 transition-colors disabled:opacity-50 flex items-center gap-2"
                            >
                                <Camera size={16} />
                                Camera
                            </button>
                        </div>
                    </div>
                </div>
                {errors[fieldName] && <p className="text-red-500 text-sm mt-2">{errors[fieldName]}</p>}
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-serif font-bold text-gray-800">Document Uploads</h2>
                <p className="text-gray-500 mt-2">Upload your required documents (PDF, JPG, PNG, DOCX allowed)</p>
            </div>

            {uploading && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-kemu-purple border-t-transparent" />
                    <span className="text-blue-800">Uploading...</span>
                </div>
            )}

            {uploadError && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
                    <AlertCircle className="text-red-600" size={20} />
                    <span className="text-red-800">{uploadError}</span>
                </div>
            )}

            <div className="space-y-4">
                <UploadBox
                    title="Passport Photo"
                    description="Recent passport-size photograph (max 5MB)"
                    fieldName="passportPhoto"
                    accept="image/jpeg,image/png,image/jpg"
                    required
                    icon={<Image size={24} />}
                    inputRef={passportPhotoRef as React.RefObject<HTMLInputElement>}
                />

                <UploadBox
                    title="National ID / Passport"
                    description="Clear copy of your ID or passport (max 5MB)"
                    fieldName="nationalIdDoc"
                    accept="image/jpeg,image/png,image/jpg,.pdf"
                    required
                    icon={<FileText size={24} />}
                    inputRef={nationalIdRef as React.RefObject<HTMLInputElement>}
                />

                <UploadBox
                    title="Academic Certificates"
                    description="KCSE, transcripts, previous certificates (multiple allowed)"
                    fieldName="academicCerts"
                    accept="image/jpeg,image/png,image/jpg,.pdf,.doc,.docx"
                    multiple
                    required
                    icon={<FileText size={24} />}
                    inputRef={academicCertsRef as React.RefObject<HTMLInputElement>}
                />

                <UploadBox
                    title="Supporting Documents"
                    description="CV, professional certificates, recommendations (optional)"
                    fieldName="supportingDocs"
                    accept="image/jpeg,image/png,image/jpg,.pdf,.doc,.docx"
                    multiple
                    icon={<FileText size={24} />}
                    inputRef={supportingDocsRef as React.RefObject<HTMLInputElement>}
                />
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="text-sm text-amber-800">
                    <strong>Important:</strong> Ensure all documents are clear and legible.
                    Blurry or unreadable documents may delay your application processing.
                </p>
            </div>
        </div>
    );
};

export default DocumentUpload;
