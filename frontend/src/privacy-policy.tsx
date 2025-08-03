import { Shield, User, Database, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect } from "react";

export function PrivacyPolicyPage() {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl mt-6">
        <div className="space-y-8">
          {/* Introduction */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Introduction
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                This Privacy Policy explains how we collect, use, and protect
                your personal information when you use our application. We are
                committed to protecting your privacy and ensuring transparency
                in our data practices.
              </p>
              <p className="text-muted-foreground">
                <strong>Last updated:</strong> {new Date().toLocaleDateString()}
              </p>
            </CardContent>
          </Card>

          {/* Information We Collect */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" />
                Information We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Personal Information</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>
                    Email address (for account creation and authentication)
                  </li>
                  <li>User ID (for session management)</li>
                  <li>Account preferences and settings</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Technical Information</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>
                    JWT tokens (for authentication and session management)
                  </li>
                  <li>IP address (for security and fraud prevention)</li>
                  <li>Browser and device information (for compatibility)</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* How We Use Your Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                How We Use Your Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-primary mb-2">
                    Authentication
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    To verify your identity and maintain secure access to your
                    account.
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-primary mb-2">
                    Service Provision
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    To provide and maintain our application services and
                    features.
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-primary mb-2">Security</h4>
                  <p className="text-sm text-muted-foreground">
                    To protect against fraud, abuse, and unauthorized access.
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-primary mb-2">
                    Communication
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    To send important account notifications and updates.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Legal Basis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Legal Basis for Processing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                We process your personal data based on the following legal
                grounds:
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Badge variant="secondary">1</Badge>
                  <div>
                    <h4 className="font-semibold">Consent</h4>
                    <p className="text-sm text-muted-foreground">
                      You have given explicit consent for the processing of your
                      personal data for authentication purposes.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Badge variant="secondary">2</Badge>
                  <div>
                    <h4 className="font-semibold">Contract</h4>
                    <p className="text-sm text-muted-foreground">
                      Processing is necessary to provide you with our services
                      and fulfill our contractual obligations.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Badge variant="secondary">3</Badge>
                  <div>
                    <h4 className="font-semibold">Legitimate Interests</h4>
                    <p className="text-sm text-muted-foreground">
                      Processing is necessary for our legitimate interests in
                      providing secure and reliable services.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Your Rights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-primary" />
                Your Rights Under GDPR
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Under the General Data Protection Regulation (GDPR), you have
                the following rights:
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-primary mb-2">
                    Right of Access
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Request a copy of your personal data and information about
                    how we process it.
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-primary mb-2">
                    Right to Rectification
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Request correction of inaccurate or incomplete personal
                    data.
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-primary mb-2">
                    Right to Erasure
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Request deletion of your personal data in certain
                    circumstances.
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-primary mb-2">
                    Right to Portability
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Request your data in a structured, machine-readable format.
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-primary mb-2">
                    Right to Object
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Object to processing of your personal data in certain
                    circumstances.
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-primary mb-2">
                    Right to Withdraw Consent
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Withdraw your consent at any time where processing is based
                    on consent.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Data Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                We implement appropriate technical and organizational measures
                to protect your personal data:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Encryption of data in transit and at rest</li>
                <li>Secure JWT token management with proper expiration</li>
                <li>Regular security assessments and updates</li>
                <li>Access controls and authentication mechanisms</li>
                <li>Data backup and disaster recovery procedures</li>
              </ul>
            </CardContent>
          </Card>

          {/* Data Retention */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" />
                Data Retention
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                We retain your personal data only for as long as necessary to
                fulfill the purposes outlined in this policy:
              </p>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <span className="font-medium">Account Data</span>
                  <span className="text-sm text-muted-foreground">
                    Until account deletion
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <span className="font-medium">JWT Tokens</span>
                  <span className="text-sm text-muted-foreground">
                    Session duration (typically 1 week)
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <span className="font-medium">Log Data</span>
                  <span className="text-sm text-muted-foreground">
                    30 days for security purposes
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center py-8 border-t">
            <p className="text-sm text-muted-foreground">
              This Privacy Policy is effective as of{" "}
              {new Date().toLocaleDateString()}. We may update this policy from
              time to time and will notify you of any material changes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
