import "./single.scss";
import { useSelector} from "react-redux";
const Single = () => {
  const theater = useSelector((state) => state.theater);



  return (
    <div className="single">
      <div className="singleContainer">
        <div className="top">
          <div className="left">
            <div className="editButton">Edit</div>
            <h1 className="title">Information</h1>
            <div className="item">
              <img
                src={theater?.application?.imageUrl}
                alt=""
                className="itemImg"
              />
              <div className="details">
                <h1 className="itemTitle">{theater?.Name}</h1>
                <div className="detailItem">
                  <span className="itemKey">Email:</span>
                  <span className="itemValue">{theater?.email}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Phone:</span>
                  <span className="itemValue">{theater?.phone}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Theater Name:</span>
                  <span className="itemValue">
                    {theater?.application?.theatername}
                  </span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">State:</span>
                  <span className="itemValue">{theater?.application?.state}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">place:</span>
                  <span className="itemValue">{theater?.application?.place}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">City:</span>
                  <span className="itemValue">{theater?.application?.city}</span>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Single;
