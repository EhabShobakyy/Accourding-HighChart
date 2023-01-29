import React, { useEffect, useState } from "react";

// to call data
import axios from "axios";
import AccessRefreshTokens from "../RefreshToken/AccessRefreshTokens";
// Modal Popup
import Modal from "../GlobalComponents/Modal/Modal.js";
// HighChart
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

// Style
import "./FinancialRatiosPage.css";
// chart image
import chartImg from "../assets/chartImg.png";

function FinancialRatiosPage() {
  const [financialRatios, setFinancialRatios] = useState([]);
  const [periodTabs, setPeriodTabs] = useState("year");
  const [chartPopup, setChartPopup] = useState([]);
  const [chartName, setChartName] = useState([]);
  const [currencyType, setCurrencyType] = useState("SAR");
  const [chartYears, setChartYears] = useState(`year`);

  useEffect(() => {
    AccessRefreshTokens.getAccessToken();
    axios
      .get(
        `https://data.argaam.com/api/v1/json/ir-api/financial-ratios?fiscalPeriodType=${periodTabs}`,
        {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((res) => {
        console.log(res.data.financialRatioFieldsGroups);
        setFinancialRatios(res.data.financialRatioFieldsGroups);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [chartPopup, periodTabs, localStorage.getItem("token")]);

  // Format Number
  const formatNum = (num) =>
    num === "-" ? null : Number(num)?.toFixed(2).replace("-", "");
  // Format Number fo Chart
  const formatNumChart = (num) =>
    num === "-" ? null : Number(num)?.toFixed(2);

  const handelChart = (e, id) => {
    setChartPopup(
      financialRatios[id].financialRatioFieldsGroupFields[e].values
        .slice(0, 5)
        .map((item) => Number(formatNumChart(item.value)))
    );

    console.log(chartPopup);

    setChartName(financialRatios[id].financialRatioFieldsGroupFields[e].nameEn);
  };

  const changeYear = () => {
    return financialRatios[0]?.financialRatioFieldsGroupFields[0]?.values
      ?.slice(0, 5)
      ?.map((years, id) => <th key={id}> {years?.[`${chartYears}`]}</th>);
  };

  const yearOptions = () => {
    let years = [];
    return (years =
      financialRatios[0]?.financialRatioFieldsGroupFields[0]?.values
        ?.slice(0, 5)
        ?.map((years) => years?.[`${chartYears}`]));
  };

  const options = {
    chart: {
      type: "column",
    },
    title: {
      text: "",
    },
    xAxis: {
      categories: yearOptions(),
    },
    yAxis: {
      title: {
        text: "",
      },
    },
    series: [
      {
        name: "Extra",
        data: chartPopup,
      },
    ],
  };

  const handelActive = (e) => {
    // to add class to chart button
    var elems = document.querySelectorAll(".active");
    [].forEach.call(elems, function (el) {
      el.classList.remove("active");
    });
    e.target.className = "active";
    setPeriodTabs(e?.target?.value);

    e?.target?.value === "quarter"
      ? setChartYears("period")
      : setChartYears("year");
  };

  const currencyActive = (e) => {
    var elems = document.querySelectorAll(".active-currency");
    [].forEach.call(elems, function (el) {
      el.classList.remove("active-currency");
    });
    e.target.className = "active-currency";
    setCurrencyType(e.target.value);
  };

  const currencyChange = (num, child) => {
    if (currencyType === "USD" && child.ratioName != "SharesOutstandings1") {
      if (isNaN(num)) return "";
      else return formatNum(num / 3.75);
    } else return formatNum(num);
  };

  return (
    <>
      <div className="financial-ratios">
        <div className="container-md my-4">
          <h3>Financial Ratios</h3>
          <div className="financial-tabs d-flex justify-content-between  my-4">
            <div className="period-btn d-flex ">
              <button className="active" value="year" onClick={handelActive}>
                Annual
              </button>
              <button value="quarter" onClick={handelActive}>
                TRAILLING 12 M
              </button>
            </div>

            <div className="currency-tabs d-flex">
              <button
                className="active-currency"
                value="SAR"
                onClick={currencyActive}
              >
                SAR
              </button>
              <button value="USD" onClick={currencyActive}>
                USD
              </button>
            </div>
          </div>

          <table className="financial-ratios-table">
            <thead>
              <tr>
                <th style={{ textAlign: "left" }}>Details</th>
                <th>Graphs</th>
                {changeYear()}
              </tr>
            </thead>
            {financialRatios?.map((item, id) => {
              return (
                <tbody key={id} className="accordion" id={`${id}`}>
                  <tr className="accordion-item">
                    <th id={id} colSpan="12" style={{ textAlign: "left" }}>
                      <button
                        className="accordion-button close-sign"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target={`#collapse${id}`}
                        aria-expanded="true"
                        aria-controls={`collapse${id}`}
                      ></button>
                      {item?.fieldGroupEn}
                    </th>
                  </tr>
                  {item?.financialRatioFieldsGroupFields?.map((child, idx) => {
                    return (
                      <tr
                        key={idx}
                        className={`data-${id}  accordion-body accordion-collapse collapse show`}
                        id={`collapse${id}`}
                        aria-labelledby={`${id}`}
                        data-bs-parent
                      >
                        <td style={{ textAlign: "left" }}>{child?.nameEn}</td>
                        <td>
                          <button
                            className="chart-btn"
                            data-bs-toggle="modal"
                            data-bs-target="#financialRatiosModal"
                          >
                            <img
                              className="chart-img"
                              src={chartImg}
                              alt="Chart Image"
                              onClick={() => handelChart(idx, `${id}`)}
                            />
                          </button>
                        </td>
                        <td>
                          <p
                            style={{
                              color:
                                child?.values[0]?.value < 0 ? "red" : "green",
                            }}
                          >
                            {currencyChange(child?.values[0]?.value, child)}
                          </p>
                        </td>
                        <td>
                          <p
                            style={{
                              color:
                                child?.values[1]?.value < 0 ? "red" : "green",
                            }}
                          >
                            {currencyChange(child?.values[1]?.value, child)}
                          </p>
                        </td>
                        <td>
                          <p
                            style={{
                              color:
                                child?.values[2]?.value < 0 ? "red" : "green",
                            }}
                          >
                            {currencyChange(child?.values[2]?.value, child)}
                          </p>
                        </td>
                        <td>
                          <p
                            style={{
                              color:
                                child?.values[3]?.value < 0 ? "red" : "green",
                            }}
                          >
                            {currencyChange(child?.values[3]?.value, child)}
                          </p>
                        </td>
                        <td>
                          <p
                            style={{
                              color:
                                child?.values[4]?.value < 0 ? "red" : "green",
                            }}
                          >
                            {currencyChange(child?.values[4]?.value, child)}
                          </p>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              );
            })}
          </table>
        </div>
      </div>
      <Modal id={"financialRatiosModal"} name={chartName}>
        <>
          <HighchartsReact highcharts={Highcharts} options={options} />
        </>
      </Modal>
    </>
  );
}
export default FinancialRatiosPage;
