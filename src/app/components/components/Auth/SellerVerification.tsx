import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Upload, FileText, Camera, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export function SellerVerification() {
  const navigate = useNavigate();
  const { user, updateVerificationStatus } = useAuth();
  const [documentType, setDocumentType] = useState<'citizenship' | 'passport' | 'license'>(
    'citizenship'
  );
  const [uploads, setUploads] = useState({
    documentFront: null as File | null,
    documentBack: null as File | null,
    selfie: null as File | null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!user) {
    navigate('/login');
    return null;
  }

  if (user.accountType !== 'seller') {
    navigate('/');
    return null;
  }

  if (user.verificationStatus === 'pending') {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-12 text-center">
            <div className="size-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="size-10 text-yellow-600" />
            </div>
            <h2 className="text-2xl mb-3">Verification In Progress</h2>
            <p className="text-neutral-600 mb-6">
              Your documents are being reviewed by our team. This usually takes 24-48 hours.
              We'll notify you via email once your account is verified.
            </p>
            <Button onClick={() => navigate('/')}>Back to Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (user.verificationStatus === 'approved') {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-12 text-center">
            <CheckCircle2 className="size-20 text-green-500 mx-auto mb-6" />
            <h2 className="text-2xl mb-3">Account Verified!</h2>
            <p className="text-neutral-600 mb-6">
              Your seller account has been verified. You can now list items for sale.
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => navigate('/sell')}>List an Item</Button>
              <Button variant="outline" onClick={() => navigate('/')}>
                Browse Items
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleFileUpload = (field: 'documentFront' | 'documentBack' | 'selfie', file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    setUploads({ ...uploads, [field]: file });
    toast.success('File uploaded successfully');
  };

  const handleSubmit = async () => {
    if (!uploads.documentFront || !uploads.selfie) {
      toast.error('Please upload all required documents');
      return;
    }

    if (documentType !== 'passport' && !uploads.documentBack) {
      toast.error('Please upload both sides of your document');
      return;
    }

    setIsSubmitting(true);

    // Simulate upload and verification
    await new Promise((resolve) => setTimeout(resolve, 2000));

    updateVerificationStatus('pending');
    toast.success('Documents submitted! We will review within 24-48 hours.');
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-12 px-4">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Seller Verification</CardTitle>
          <CardDescription>
            Complete identity verification to start selling on Vintage Nepal
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Commission Info */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-medium mb-2">Important Information</h3>
            <ul className="text-sm text-neutral-700 space-y-1 list-disc list-inside">
              <li>We charge a 10% commission on all successful sales</li>
              <li>Verification typically takes 24-48 hours</li>
              <li>All information is kept confidential and secure</li>
              <li>You must be 18 or older to sell on our platform</li>
            </ul>
          </div>

          {/* Document Type Selection */}
          <div className="space-y-3">
            <Label>Select ID Document Type</Label>
            <RadioGroup value={documentType} onValueChange={setDocumentType as any}>
              <div className="grid grid-cols-3 gap-4">
                <label
                  className={`flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition ${
                    documentType === 'citizenship'
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-neutral-200'
                  }`}
                >
                  <RadioGroupItem value="citizenship" id="citizenship" className="sr-only" />
                  <FileText className="size-8 mb-2" />
                  <span className="text-sm font-medium">Citizenship</span>
                </label>

                <label
                  className={`flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition ${
                    documentType === 'passport'
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-neutral-200'
                  }`}
                >
                  <RadioGroupItem value="passport" id="passport" className="sr-only" />
                  <FileText className="size-8 mb-2" />
                  <span className="text-sm font-medium">Passport</span>
                </label>

                <label
                  className={`flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition ${
                    documentType === 'license'
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-neutral-200'
                  }`}
                >
                  <RadioGroupItem value="license" id="license" className="sr-only" />
                  <FileText className="size-8 mb-2" />
                  <span className="text-sm font-medium">License</span>
                </label>
              </div>
            </RadioGroup>
          </div>

          {/* Document Upload - Front */}
          <div className="space-y-2">
            <Label>
              {documentType === 'passport' ? 'Passport Photo Page' : 'Document Front Side'} *
            </Label>
            <div className="border-2 border-dashed border-neutral-300 rounded-lg p-8 text-center hover:border-orange-500 transition">
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  e.target.files?.[0] && handleFileUpload('documentFront', e.target.files[0])
                }
                className="hidden"
                id="front-upload"
              />
              <label htmlFor="front-upload" className="cursor-pointer">
                <Upload className="size-12 text-neutral-400 mx-auto mb-3" />
                {uploads.documentFront ? (
                  <p className="text-green-600 font-medium">{uploads.documentFront.name}</p>
                ) : (
                  <>
                    <p className="text-neutral-600 mb-1">Click to upload or drag and drop</p>
                    <p className="text-sm text-neutral-500">PNG, JPG up to 5MB</p>
                  </>
                )}
              </label>
            </div>
          </div>

          {/* Document Upload - Back (if not passport) */}
          {documentType !== 'passport' && (
            <div className="space-y-2">
              <Label>Document Back Side *</Label>
              <div className="border-2 border-dashed border-neutral-300 rounded-lg p-8 text-center hover:border-orange-500 transition">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    e.target.files?.[0] && handleFileUpload('documentBack', e.target.files[0])
                  }
                  className="hidden"
                  id="back-upload"
                />
                <label htmlFor="back-upload" className="cursor-pointer">
                  <Upload className="size-12 text-neutral-400 mx-auto mb-3" />
                  {uploads.documentBack ? (
                    <p className="text-green-600 font-medium">{uploads.documentBack.name}</p>
                  ) : (
                    <>
                      <p className="text-neutral-600 mb-1">Click to upload or drag and drop</p>
                      <p className="text-sm text-neutral-500">PNG, JPG up to 5MB</p>
                    </>
                  )}
                </label>
              </div>
            </div>
          )}

          {/* Selfie Upload */}
          <div className="space-y-2">
            <Label>Selfie with ID Document *</Label>
            <p className="text-sm text-neutral-600">
              Take a selfie holding your ID document next to your face
            </p>
            <div className="border-2 border-dashed border-neutral-300 rounded-lg p-8 text-center hover:border-orange-500 transition">
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  e.target.files?.[0] && handleFileUpload('selfie', e.target.files[0])
                }
                className="hidden"
                id="selfie-upload"
              />
              <label htmlFor="selfie-upload" className="cursor-pointer">
                <Camera className="size-12 text-neutral-400 mx-auto mb-3" />
                {uploads.selfie ? (
                  <p className="text-green-600 font-medium">{uploads.selfie.name}</p>
                ) : (
                  <>
                    <p className="text-neutral-600 mb-1">Click to upload or drag and drop</p>
                    <p className="text-sm text-neutral-500">PNG, JPG up to 5MB</p>
                  </>
                )}
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1"
              size="lg"
            >
              {isSubmitting ? 'Submitting...' : 'Submit for Verification'}
            </Button>
            <Button variant="outline" onClick={() => navigate('/')} size="lg">
              Cancel
            </Button>
          </div>

          {/* Help Text */}
          <p className="text-sm text-neutral-600 text-center">
            Having trouble? Contact us at{' '}
            <a href="mailto:support@vintagenepal.com" className="text-orange-500 hover:underline">
              support@vintagenepal.com
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}