const express = require("express");
const router = express.Router();
const charts = require("../controllers/charts_view");

router.get("/sales", charts.sales);
router.get("/dashcount", charts.allcount);
router.get("/graphadmin", charts.graphadminLast30Days);
router.get("/companybygrades", charts.getCompanyCountsByGrade);
router.get("/companybyhistory", charts.getCompanyCountsByHistory);
router.get("/companybymonth", charts.companyCountByMonth);
router.get("/companyYearanal/:companyName", charts.companyYearanal);
router.post("/companyoverview/", charts.overviewCompany);
router.post("/companySales/records", charts.companySalesRecord);
router.post("/companySales/types", charts.companySalesTypes);
router.post("/companySales/salesPersonrecords", charts.SalesPersonSalesRecord);
router.post("/companyCollections/records", charts.companyCollectionRecord);
router.post("/companyCollections/salesPersonrecords", charts.SalesPersonCollectionRecord);
module.exports = router;
