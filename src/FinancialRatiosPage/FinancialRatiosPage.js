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
  const [chartYears, setChartYears] = useState([
    "2022",
    "2021",
    "2020",
    "2019",
    "2018",
  ]);

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
  }, [periodTabs, localStorage.getItem("token")]);

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

    // setChartYears(
    //   financialRatios[id].financialRatioFieldsGroupFields[e].values
    //     .slice(0, 5)
    //     .map((item) => item.year)
    // );
    setChartName(financialRatios[id].financialRatioFieldsGroupFields[e].nameEn);
  };

  const options = {
    chart: {
      type: "column",
    },
    title: {
      text: "",
    },
    xAxis: {
      categories: chartYears,
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
  // {
  //   console.log(
  //     financialRatios[0]?.financialRatioFieldsGroupFields[0]?.values
  //       ?.slice(0, 4)
  //       ?.map((years) => years)
  //   );
  // }

  const handelActive = (e) => {
    // to add class to chart button
    var elems = document.querySelectorAll(".active");
    [].forEach.call(elems, function (el) {
      el.classList.remove("active");
    });
    e.target.className = "active";
    setPeriodTabs(e?.target?.value);
  };

  const currencyActive = (e, num) => {
    var elems = document.querySelectorAll(".active-currency");
    [].forEach.call(elems, function (el) {
      el.classList.remove("active-currency");
    });
    e.target.className = "active-currency";
    setCurrencyType(e.target.value);
  };

  const currencyChange = (num) => {
    if (currencyType === "USD") {
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
                {chartYears.map((year, id) => {
                  return <th key={id}>{year}</th>;
                })}
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
                            {currencyChange(child?.values[0]?.value)}
                          </p>
                        </td>
                        <td>
                          <p
                            style={{
                              color:
                                child?.values[1]?.value < 0 ? "red" : "green",
                            }}
                          >
                            {currencyChange(child?.values[1]?.value)}
                          </p>
                        </td>
                        <td>
                          <p
                            style={{
                              color:
                                child?.values[2]?.value < 0 ? "red" : "green",
                            }}
                          >
                            {currencyChange(child?.values[2]?.value)}
                          </p>
                        </td>
                        <td>
                          <p
                            style={{
                              color:
                                child?.values[3]?.value < 0 ? "red" : "green",
                            }}
                          >
                            {currencyChange(child?.values[3]?.value)}
                          </p>
                        </td>
                        <td>
                          <p
                            style={{
                              color:
                                child?.values[4]?.value < 0 ? "red" : "green",
                            }}
                          >
                            {currencyChange(child?.values[4]?.value)}
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
