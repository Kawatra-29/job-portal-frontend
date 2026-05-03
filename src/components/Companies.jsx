import CompanyCard from "./CompanyCard";

const companyList = [
  { id: 1, name: "AMAZON PVT LTD", location: "Lajpat Nagar, Sahibabad, Ghaziabad, UP" },
  { id: 2, name: "FLIPKART PVT LTD", location: "Rajender Nagar, Sahibabad, Ghaziabad, UP" },
  { id: 3, name: "TCS (TATA CONSULTANCY SERVICES)", location: "Noida Sector 62, UP" },
  { id: 4, name: "INFOSYS LTD", location: "Electronic City, Bangalore, Karnataka" },
  { id: 5, name: "WIPRO LTD", location: "Gurgaon, Haryana" },
  { id: 6, name: "HCL TECHNOLOGIES", location: "Noida Sector 126, UP" },
  { id: 7, name: "ZOMATO PVT LTD", location: "Gurgaon, Haryana" },
  { id: 8, name: "SWIGGY PVT LTD", location: "Bangalore, Karnataka" },
  { id: 9, name: "PAYTM", location: "Noida Sector 5, UP" },
  { id: 10, name: "OLA CABS", location: "Bangalore, Karnataka" },
];

function Companies() {
  return (
    <div>
      <h1 className="mt-10 text-center h-15 border-b-2 border-blue-500 bg-gray-100 text-4xl">
        Companies
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
        {companyList.map((company, index) => (
          <CompanyCard key={company.id} companies={company} index={index} />
        ))}
      </div>
    </div>
  );
}

export default Companies;