import { Popup } from "react-map-gl";
import axios from "axios";
import { useState, useRef, useEffect } from "react";
import TrailComments from "./trailcomments";

export default function MapPopup({ selectedTrail, setSelectedTrail }) {
    const [count, setCount] = useState(0);
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [comment, setComment] = useState("");

    useEffect(() => {
        (async () => {
            console.log("quering server for likes");
            const { data } = await axios.get(
                `/api/map/${selectedTrail.properties.id}`
            );
            console.log("quering server for likes data", data.count);
            setCount(parseInt(data.count));
        })();
    }, [selectedTrail.properties.id]);

    return (
        <Popup
            latitude={selectedTrail.geometry.coordinates[0]}
            longitude={selectedTrail.geometry.coordinates[1]}
            closeButton={true}
            closeOnClick={false}
            onClose={() => {
                setSelectedTrail(null);
            }}
        >
            <h1>{selectedTrail.properties.title}</h1>
            <p>{selectedTrail.properties.address}</p>
            <img
                className="trailImg"
                src={selectedTrail.properties.imageurl}
                alt={selectedTrail.properties.address}
            />
            <div className="likeContainer">
                <button
                    className={
                        !buttonDisabled ? "likeButton" : "likeButtonDisabled"
                    }
                    disabled={buttonDisabled}
                    onClick={(e) => {
                        e.preventDefault();
                        setButtonDisabled(true);
                        axios
                            .post(`/api/map/`, {
                                trailId: selectedTrail.properties.id,
                                address: selectedTrail.properties.address,
                                title: selectedTrail.properties.title,
                            })
                            .then(({ data }) => {
                                console.log(" data api/map/", data);
                                if (data.success) {
                                    setCount(count + 1);
                                }
                            })
                            .catch((err) => {
                                console.log("error in /api/map/", err);
                            });
                    }}
                >
                    Like!
                </button>
                <em className="countOfLikes">Likes: {count}</em>
            </div>
            {/* <button
                style={{ color: "red" }}
                onClick={(e) => {
                    e.preventDefault();
                    setUnlike(unlike - 1);
                }}
            >
                Unlike
            </button>
            <p>Uniked: {unlike} </p> */}
            <TrailComments
                trailId={selectedTrail.properties.id}
            ></TrailComments>
        </Popup>
    );
}
