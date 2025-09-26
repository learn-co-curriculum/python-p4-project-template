import { Formik, Form, Field, ErrorMessage, useFormikContext } from "formik";
import * as Yup from "yup";
import { useState, useEffect } from "react";

export default function BookingForm({ propertyId, onSubmit, pricePerNight }) {
  const [totalPrice, setTotalPrice] = useState(0);

  const today = new Date().toISOString().split("T")[0];

  const validationSchema = Yup.object({
    guest_name: Yup.string()
      .required("Name is required")
      .min(2, "Name must be at least 2 characters"),
    guest_email: Yup.string()
      .email("Invalid email")
      .required("Email is required"),
    check_in_date: Yup.date()
      .required("Check-in date is required")
      .min(today, "Check-in date must be today or in the future"),
    check_out_date: Yup.date()
      .required("Check-out date is required")
      .min(Yup.ref("check_in_date"), "Check-out must be after check-in"),
  });

  const calculateTotalPrice = (checkIn, checkOut) => {
    if (checkIn && checkOut && pricePerNight) {
      const startDate = new Date(checkIn);
      const endDate = new Date(checkOut);
      const timeDiff = endDate.getTime() - startDate.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
      if (daysDiff > 0) {
        return daysDiff * pricePerNight;
      }
    }
    return 0;
  };

  // ✅ A small component to handle price calculation with hooks
  function PriceWatcher() {
    const { values } = useFormikContext();

    useEffect(() => {
      const total = calculateTotalPrice(
        values.check_in_date,
        values.check_out_date
      );
      setTotalPrice(total);
    }, [values.check_in_date, values.check_out_date]);

    return null; // doesn't render anything
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Book this property</h3>

      <div className="mb-4 p-3 bg-blue-50 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold">${pricePerNight}</span>
          <span className="text-gray-600">per night</span>
        </div>
      </div>

      <Formik
        initialValues={{
          guest_name: "",
          guest_email: "",
          check_in_date: "",
          check_out_date: "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { resetForm }) => {
          const bookingData = {
            ...values,
            property_id: propertyId,
            total_price: totalPrice,
          };
          onSubmit(bookingData);
          resetForm();
          setTotalPrice(0);
        }}
      >
        {({ values }) => (
          <Form className="space-y-4">
            {/* Hook runs here via helper component */}
            <PriceWatcher />

            <div>
              <label
                htmlFor="guest_name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Full Name
              </label>
              <Field
                name="guest_name"
                id="guest_name"
                placeholder="Enter your full name"
                className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <ErrorMessage
                name="guest_name"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <div>
              <label
                htmlFor="guest_email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address
              </label>
              <Field
                name="guest_email"
                id="guest_email"
                type="email"
                placeholder="Enter your email"
                className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <ErrorMessage
                name="guest_email"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="check_in_date"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Check-in
                </label>
                <Field
                  name="check_in_date"
                  id="check_in_date"
                  type="date"
                  min={today}
                  className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage
                  name="check_in_date"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div>
                <label
                  htmlFor="check_out_date"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Check-out
                </label>
                <Field
                  name="check_out_date"
                  id="check_out_date"
                  type="date"
                  min={values.check_in_date || today}
                  className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage
                  name="check_out_date"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
            </div>

            {totalPrice > 0 && (
              <div className="p-3 bg-gray-50 rounded-lg border">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total Price:</span>
                  <span className="text-xl font-bold text-green-600">
                    ${totalPrice}
                  </span>
                </div>
                {values.check_in_date && values.check_out_date && (
                  <div className="text-sm text-gray-600 mt-1">
                    {Math.ceil(
                      (new Date(values.check_out_date) -
                        new Date(values.check_in_date)) /
                        (1000 * 3600 * 24)
                    )}{" "}
                    nights × ${pricePerNight}
                  </div>
                )}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-400"
              disabled={totalPrice === 0}
            >
              {totalPrice > 0
                ? `Book Now - ${totalPrice}`
                : "Select Dates to Book"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
