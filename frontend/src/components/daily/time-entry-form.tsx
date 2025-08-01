import React from "react";
import { X, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "react-i18next";

interface TimeEntryFormProps {
  timeInput: string;
  notesInput: string;
  isSaving: boolean;
  onTimeInputChange: (value: string) => void;
  onNotesInputChange: (value: string) => void;
  onCancel: () => void;
  onSave: () => void;
}

const TimeEntryForm: React.FC<TimeEntryFormProps> = ({
  timeInput,
  notesInput,
  isSaving,
  onTimeInputChange,
  onNotesInputChange,
  onCancel,
  onSave,
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col space-y-3 p-4 bg-muted/30 rounded-md">
      <div className="text-sm font-medium mb-1">
        {t("bilan.addTimeForTask")}
      </div>
      <div className="flex items-center">
        <span className="w-24 text-sm">{t("bilan.timeSpent")}</span>
        <Input
          value={timeInput}
          onChange={(e) => onTimeInputChange(e.target.value)}
          placeholder="e.g., 1h 30m"
          className="w-32"
        />
      </div>
      <div className="flex items-start">
        <span className="w-24 text-sm mt-2">{t("bilan.notes")}:</span>
        <Textarea
          value={notesInput}
          onChange={(e) => onNotesInputChange(e.target.value)}
          placeholder={t("bilan.optionalNotes")}
          className="min-h-[80px] flex-1"
        />
      </div>
      <div className="flex justify-end space-x-2 mt-2">
        <Button variant="outline" size="sm" onClick={onCancel}>
          <X className="h-4 w-4 mr-1" />
          {t("bilan.cancel")}
        </Button>
        <Button
          variant="default"
          size="sm"
          onClick={onSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <span className="mr-1 inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></span>
              {t("bilan.saving")}
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-1" />
              {t("bilan.save")}
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default TimeEntryForm;
