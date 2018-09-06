export const display_fields = {
  ethiopian_national_identifier: "National Id",
  name: "Name",
  "facility_type-1": "Facility Type",
  hmis_code: "HMIS Code",
  "ownership-1": "Ownership",
  // construction_status: "Construction",
  Admin_health_hierarchy: "Admin Unit"
};

export const admin_units = [
  {
    unit: "Amhara Region",
    hierarchy: [
      {
        unit: "Awi Zone",
        hierarchy: {
          unit: "Banja Woreda"
        }
      }
    ]
  },
  {
    unit: "Oromia Region",
    hierarchy: [
      {
        unit: "Asalla Town Zone",
        hierarchy: {
          unit: "Asalla Woreda"
        }
      }
    ]
  }
];
