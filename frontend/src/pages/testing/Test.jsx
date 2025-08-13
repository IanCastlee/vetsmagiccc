import "./Test.scss";
import { CiEdit } from "react-icons/ci";
import { CiSearch } from "react-icons/ci";
import image from "../../assets/imges/veterinarian1.png";

const Test = () => {
  return (
    <div className="h-screen w-full bg-blue-200 flex justify-center items-center z-50">
      <div className="h-[89%] w-[320px] bg-black rounded-2xl border-[8px] border-gray-600 flex-col p-[0.625rem]">
        <div className="flex mb-4">
          <span className="text-[8px] text-gray-300">6:23 PM</span>
        </div>

        <div className="flex justify-between">
          <h1 className="text-gray-100 font-bold text-2xl">messenger</h1>

          <div className="flex items-center gap-[7px]">
            <CiEdit className="text-gray-100 text-xl" />
            <h2 className="text-blue-600 text-2xl">f</h2>
          </div>
        </div>

        <div className="w-full h-[32px] bg-gray-600 flex items-center rounded-2xl mt-[7px] px-[10px]">
          <CiSearch className="text-white text-xl mr-[5px]" />
          <input
            type="Search"
            placeholder="Search"
            className="w-[85%] h-full bg-gray-600 flex items-center"
          />
        </div>

        <div className="w-full  flex items-center mt-[20px] gap-[12px]">
          <div className="flex flex-col">
            <div>
              <img src={image} className="h-[45px] w-[45px] rounded-full" />
            </div>
            <span className="text-white text-sm">Eyhan</span>
          </div>
          <div className="flex flex-col">
            <div>
              <img src={image} className="h-[45px] w-[45px] rounded-full" />
            </div>
            <span className="text-white text-sm">Eyhan</span>
          </div>
          <div className="flex flex-col">
            <div>
              <img src={image} className="h-[45px] w-[45px] rounded-full" />
            </div>
            <span className="text-white text-sm">Eyhan</span>
          </div>
          <div className="flex flex-col">
            <div>
              <img src={image} className="h-[45px] w-[45px] rounded-full" />
            </div>
            <span className="text-white text-sm">Eyhan</span>
          </div>
          <div className="flex flex-col">
            <div>
              <img src={image} className="h-[45px] w-[45px] rounded-full" />
            </div>
            <span className="text-white text-sm">Eyhan</span>
          </div>
        </div>

        <div className="flex flex-col mt-4 gap-4">
          <div className="flex gap-4">
            <div>
              <img
                src={image}
                className="h-[40px] w-[40px] rounded-full border border-gray-700"
              />
            </div>

            <div className="flex flex-col">
              <span className="text-white text-[12px] font-bold">Hayabusa</span>
              <div className="flex items-center gap-[5px]">
                <p className="text-white text-[12px]">Lorem ipsum dolor sit.</p>
                <p className="text-white text-[10px]">5:19 PM</p>
              </div>
            </div>
          </div>{" "}
          <div className="flex gap-4">
            <div>
              <img
                src={image}
                className="h-[40px] w-[40px] rounded-full border border-gray-700"
              />
            </div>

            <div className="flex flex-col">
              <span className="text-white text-[12px] font-bold">Hayabusa</span>
              <div className="flex items-center gap-[5px]">
                <p className="text-white text-[12px]">Lorem ipsum dolor sit.</p>
                <p className="text-white text-[10px]">5:19 PM</p>
              </div>
            </div>
          </div>{" "}
          <div className="flex gap-4">
            <div>
              <img
                src={image}
                className="h-[40px] w-[40px] rounded-full border border-gray-700"
              />
            </div>

            <div className="flex flex-col">
              <span className="text-white text-[12px] font-bold">Hayabusa</span>
              <div className="flex items-center gap-[5px]">
                <p className="text-white text-[12px]">Lorem ipsum dolor sit.</p>
                <p className="text-white text-[10px]">5:19 PM</p>
              </div>
            </div>
          </div>{" "}
          <div className="flex gap-4">
            <div>
              <img
                src={image}
                className="h-[40px] w-[40px] rounded-full border border-gray-700"
              />
            </div>

            <div className="flex flex-col">
              <span className="text-white text-[12px] font-bold">Hayabusa</span>
              <div className="flex items-center gap-[5px]">
                <p className="text-white text-[12px]">Lorem ipsum dolor sit.</p>
                <p className="text-white text-[10px]">5:19 PM</p>
              </div>
            </div>
          </div>{" "}
          <div className="flex gap-4">
            <div>
              <img
                src={image}
                className="h-[40px] w-[40px] rounded-full border border-gray-700"
              />
            </div>

            <div className="flex flex-col">
              <span className="text-white text-[12px] font-bold">Hayabusa</span>
              <div className="flex items-center gap-[5px]">
                <p className="text-white text-[12px]">Lorem ipsum dolor sit.</p>
                <p className="text-white text-[10px]">5:19 PM</p>
              </div>
            </div>
          </div>{" "}
          <div className="flex gap-4">
            <div>
              <img
                src={image}
                className="h-[40px] w-[40px] rounded-full border border-gray-700"
              />
            </div>

            <div className="flex flex-col">
              <span className="text-white text-[12px] font-bold">Hayabusa</span>
              <div className="flex items-center gap-[5px]">
                <p className="text-white text-[12px]">Lorem ipsum dolor sit.</p>
                <p className="text-white text-[10px]">5:19 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="form-group">
        <input type="text" id="name" required />
        <label for="name">Your Name</label>
      </div>
    </div>
  );
};

export default Test;
