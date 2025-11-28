import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "../../../ui/dialog";
import { Button } from "../../../ui/button";
import { Label } from "../../../ui/label";
import InputField from "../../InputField";
import { Edit, BirdIcon, ScaleIcon } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";

interface EditableEntry {
  id?: number;
  srNo: number;
  birds: number;
  weight: number;
}

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  entry: EditableEntry | null;
  onSave: (updatedEntry: EditableEntry) => void; // send only final object
}

const validationSchema = Yup.object({
  birds: Yup.number()
    .typeError("Birds must be a number")
    .min(1, "Birds must be greater than 0")
    .required("Required"),
  weight: Yup.number()
    .typeError("Weight must be a number")
    .min(0.01, "Weight must be greater than 0")
    .required("Required"),
});

const EditStockOutEntryModal: React.FC<EditModalProps> = ({
  isOpen,
  onClose,
  entry,
  onSave,
}) => {
  if (!entry) return null;

  // --- FORMIK ---
  const formik = useFormik({
    enableReinitialize: true, // important when opening a new row to edit
    initialValues: {
      birds: entry.birds,
      weight: entry.weight,
    },
    validationSchema,
    onSubmit: (values) => {
      const updatedEntry: EditableEntry = {
        id: entry.id,
        srNo: entry.srNo,
        birds: Number(values.birds),
        weight: Number(values.weight),
      };

      onSave(updatedEntry); // send only clean final object
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white rounded-xl shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-emerald-800 flex items-center gap-2">
            <Edit className="w-5 h-5 text-emerald-700" />
            Edit Entry #{entry.srNo}
          </DialogTitle>
          <DialogDescription>
            Modify the bird count or weight. Click save when finished.
          </DialogDescription>
        </DialogHeader>

        {/* FORM BODY */}
        <form onSubmit={formik.handleSubmit} className="grid gap-4 py-4">
          {/* Birds Input */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="birds" className="text-right">
              Birds
            </Label>

            <div className="col-span-3">
              <InputField
                name="birds"
                type="number"
                value={formik.values.birds}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.birds && formik.errors.birds}
                icon={<BirdIcon className="w-4 h-4 text-emerald-600" />}
              />
            </div>
          </div>

          {/* Weight Input */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="weight" className="text-right">
              Weight (kg)
            </Label>

            <div className="col-span-3">
              <InputField
                name="weight"
                type="number"
                value={formik.values.weight}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.weight && formik.errors.weight}
                icon={<ScaleIcon className="w-4 h-4 text-emerald-600" />}
              />
            </div>
          </div>

          <DialogFooter className="mt-2">
            <Button type="button" variant="outline" onClick={onClose} className="mr-2">
              Cancel
            </Button>

            <Button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white">
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditStockOutEntryModal;
