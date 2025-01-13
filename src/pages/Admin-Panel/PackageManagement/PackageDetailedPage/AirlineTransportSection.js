// AirlineTransportSection.js
import React from "react";
import { TbCheckbox } from "react-icons/tb";
import { NumericFormat } from "react-number-format";

const AirlineTransportSection = ({ packageDetail }) => (
  <div className="space-y-3 ">
    <div className="md:flex gap-4 items-center bg-[#E6F4F0] p-2 px-4">
      <p className="text-lg md:text-xl font-medium">Airline</p>
      {packageDetail.airline_detail &&
        packageDetail.airline_detail.map((airline, index) => (
          <div key={index} className="md:flex gap-10">
            <div className="flex gap-3 items-center space-y-1">
              <TbCheckbox className="h-3 md:h-4 mt-1 text-[#00936c]" />
              <p className="text-[14px] font-[500]">{airline.airline_name}</p>
            </div>
            <div className="flex gap-3 items-center space-y-1">
              <TbCheckbox className="h-3 md:h-4 mt-1 text-[#00936c]" />
              <p className="text-[14px] font-[500]">{airline.ticket_type}</p>
            </div>
            <div className="flex gap-3 items-center space-y-1">
              <TbCheckbox className="h-3 md:h-4 mt-1 text-[#00936c]" />
              <p className="text-[14px] font-[500]">
                {airline.is_return_flight_included
                  ? "Return Flight"
                  : "One Way"}
              </p>
            </div>
          </div>
        ))}
    </div>
    <hr className="w-full" />
    {packageDetail.transport_detail &&
      packageDetail.transport_detail.map((transport, index) => (
        <div
          key={index}
          className="md:flex gap-4 items-center bg-white p-2 px-4"
        >
          <p className="text-lg md:text-xl font-medium">
            {transport.transport_name}
          </p>
          <div className="block gap-10">
            <div className="flex flex-wrap gap-3">
              {transport.routes.split(",").map((part, idx) => (
                <div
                  className="flex items-center gap-3"
                  style={{ whiteSpace: "nowrap" }}
                  key={idx}
                >
                  <TbCheckbox className="h-3 md:h-4 mt-1 text-[#00936c]" />
                  <p className="text-sm font-thin">{part.trim()}</p>
                </div>
              ))}
              <div className="flex-1">
                <p className="text-[14px] font-[500]">
                  {transport.transport_type.split(",").map((part, idx) => (
                    <div
                      className="flex gap-3 items-center space-y-1"
                      key={idx}
                    >
                      <TbCheckbox className="h-3 md:h-4 mt-1 text-[#00936c]" />
                      <p className="text-sm font-thin">{part.trim()}</p>
                    </div>
                  ))}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    <hr className="w-full" />
    <div>
      <p className="text-lg md:text-xl font-medium">Mecca & Madinah Zyarah</p>
      {packageDetail.ziyarah_detail &&
        packageDetail.ziyarah_detail.map((ziyarah, index) => (
          <div key={index} className="md:flex gap-5 items-center">
            <div
              className="flex flex-wrap items-center gap-3"
              style={{ maxWidth: "100%", overflowX: "auto" }}
            >
              {ziyarah.ziyarah_list.split(",").map((part, idx) => (
                <div
                  className="flex items-center gap-3"
                  style={{ whiteSpace: "nowrap" }}
                  key={idx}
                >
                  <TbCheckbox className="h-3 md:h-4 mt-1 text-[#00936c]" />
                  <p className="text-sm font-thin">{part.trim()}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
    </div>
    <div className="space-y-3 w-full ">
      <div className="w-full space-y-1.5">
        <p className="text-[18px] font-[600]">Additional Persons Cost:</p>
        <div className="space-y-2 md:space-y-0 md:flex gap-6 bg-white p-3 rounded-sm">
          <div className="flex items-center gap-3">
            <TbCheckbox className={`h-3 md:h-4 text-[#00936c] `} />
            <div className="flex items-center gap-3 text-[14px] font-[400] font-kd">
              <p>Infants</p>
              <p className="text-[#00936c]">
                <NumericFormat
                  value={packageDetail.cost_for_infants}
                  displayType={"text"}
                  thousandSeparator
                  decimalScale={2}
                  fixedDecimalScale={true}
                />
              </p>
            </div>
          </div>{" "}
          <div className="flex items-center gap-3">
            <TbCheckbox className={`h-3 md:h-4 text-[#00936c] `} />
            <div className="flex items-center gap-3 text-[14px] font-[400] font-kd">
              <p>Child</p>
              <p className="text-[#00936c]">
                <NumericFormat
                  value={packageDetail.cost_for_child}
                  displayType={"text"}
                  thousandSeparator
                  decimalScale={2}
                  fixedDecimalScale={true}
                />
              </p>
            </div>
          </div>{" "}
          <div className="flex items-center gap-3">
            <TbCheckbox className={`h-3 md:h-4 text-[#00936c] `} />
            <div className="flex items-center gap-3 text-[14px] font-[400] font-kd">
              <p>Adult</p>
              <p className="text-[#00936c]">
                <NumericFormat
                  value={packageDetail.package_base_cost}
                  displayType={"text"}
                  thousandSeparator
                  decimalScale={2}
                  fixedDecimalScale={true}
                />{" "}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full space-y-1.5">
        <p className="text-[18px] font-[600]">Hotel Additional Cost:</p>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 xl:gap-6 rounded-md">
          <div className="text-[14px] text-center font-[400] p-2 px-6 text-[#00936c] rounded-sm bg-[#00936C1A] font-kd">
            <p>Single room</p>
            <NumericFormat
              value={packageDetail.cost_for_single}
              displayType={"text"}
              thousandSeparator
              decimalScale={2}
              fixedDecimalScale={true}
            />
          </div>
          <div className="text-[14px] text-center font-[400] p-2 px-6 text-[#00936c] rounded-sm bg-[#00936C1A] font-kd">
            <p>Double Room</p>
            <NumericFormat
              value={packageDetail.cost_for_double}
              displayType={"text"}
              thousandSeparator
              decimalScale={2}
              fixedDecimalScale={true}
            />
          </div>

          <div className="text-[14px] text-center font-[400] p-2 px-6 text-[#00936c] rounded-sm bg-[#00936C1A] font-kd">
            <p>Triple Room</p>
            <NumericFormat
              value={packageDetail.cost_for_triple}
              displayType={"text"}
              thousandSeparator
              decimalScale={2}
              fixedDecimalScale={true}
            />
          </div>

          <div className="text-[14px] text-center font-[400] p-2 px-6 text-[#00936c] rounded-sm bg-[#00936C1A] font-kd">
            <p>Quad Room</p>
            <NumericFormat
              value={packageDetail.cost_for_quad}
              displayType={"text"}
              thousandSeparator
              decimalScale={2}
              fixedDecimalScale={true}
            />
          </div>

          <div className="text-[14px] text-center font-[400] p-2 px-6 text-[#00936c] rounded-sm bg-[#00936C1A] font-kd">
            <p>Sharing Room</p>
            <NumericFormat
              value={packageDetail.cost_for_sharing}
              displayType={"text"}
              thousandSeparator
              decimalScale={2}
              fixedDecimalScale={true}
            />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default AirlineTransportSection;
