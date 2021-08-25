import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import {
    receiveFriendsAndWannabees,
    acceptFriendRequest,
    unfriend,
} from "./redux/friends/slice.js";
import { Link } from "react-router-dom";

// 1)Dispatch an action when the component mounts to populate
// the global state with data about the current friends and wannabees

// 2)Dispatch actions when the friendship buttons are clicked.
// (don't reuse the button from Part 8 here, it is probably not suited for this situation)

export default function Friends() {
    const dispatch = useDispatch();

    useEffect(() => {
        (async () => {
            const { data } = await axios.get("/api/friends").catch((err) => {
                console.log("Errororo in friends, axios /api/friends", err);
            });
            console.log("data in axios friends.js", data);
            dispatch(receiveFriendsAndWannabees(data));
        })();
    }, []);

    // --------------------------------------------------
    const cancel = (arg) => {
        const id = arg;
        axios
            .post("/button/cancel", { otherId: id })
            .then(({ data }) => {
                console.log("FRIENDS.JS: unfriend button worked", data);
            })
            .catch((err) => {
                console.log(
                    "FRIENds.JS: button clicked axios.post: ERROR:",
                    err
                );
            });
    };

    const accept = (arg) => {
        const id = arg;
        axios
            .post("/button/accept", { otherId: id })
            .then(({ data }) => {
                console.log("FRIENDS.JS: accept button worked", data);
            })
            .catch((err) => {
                console.log(
                    "FRIENds.JS: button clicked axios.post: ERROR:",
                    err
                );
            });
    };

    // --------------------------------------------------
    const friends = useSelector((state) => {
        console.log("state", state);
        console.log("state.friends", state.friends);
        console.log("state.friendsAndWannabes", state.friendsAndWannabees);
        return (
            state.friendsAndWannabees &&
            state.friendsAndWannabees.filter(({ accepted }) => accepted)
        );
    });
    const wannabees = useSelector((state) => {
        return (
            state.friendsAndWannabees &&
            state.friendsAndWannabees.filter(({ accepted }) => !accepted)
        );
    });
    console.log("friends in friends.js: ", friends);
    console.log("wannabes in friends.js: ", wannabees);

    return (
        <div className="cont">
            <div className="wannabeeContainer">
                <h3 className="wannabeeText">
                    See who wants to be your friend
                </h3>
                {wannabees &&
                    wannabees.map((user) => (
                        <div key={user.id}>
                            <Link to={"/user/" + user.id}>
                                <img
                                    className="friendsPic"
                                    src={
                                        user.imageurl ||
                                        "/default-profilepic.jpg"
                                    }
                                />
                            </Link>
                            <div>
                                <p>
                                    {user.first} {user.last}
                                </p>
                                <button
                                    onClick={() => {
                                        dispatch(acceptFriendRequest(user.id));
                                        accept(user.id);
                                    }}
                                    className="friendsButton"
                                >
                                    Accept FriendRequest
                                </button>
                            </div>
                        </div>
                    ))}
            </div>
            <div>
                {/* <h3 className="acceptedFriends">See your Friends</h3> */}
                <div className="friendsContainer">
                    <h3 className="acceptedFriendsText">See your Friends</h3>
                    {friends &&
                        friends.map((user) => (
                            <div key={user.id}>
                                <Link to={"/user/" + user.id}>
                                    <img
                                        className="friendsPic"
                                        src={
                                            user.imageurl ||
                                            "/default-profilepic.jpg"
                                        }
                                    />
                                </Link>
                                <div>
                                    <p>
                                        {user.first} {user.last}
                                    </p>
                                    <button
                                        onClick={() => {
                                            dispatch(unfriend(user.id));
                                            cancel(user.id);
                                        }}
                                        className="friendsButton"
                                    >
                                        Unfriend
                                    </button>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
}

//  return (
//         <div className="cont">
//             <div className="wannabeeContainer">
//                 <h3 className="wannabeeText">
//                     See who wants to be your friend
//                 </h3>
//                 {wannabees &&
//                     wannabees.map((user) => (
//                         <div key={user.id}>
//                             <Link to={"/user/" + user.id}>
//                                 <img
//                                     className="friendsPic"
//                                     src={
//                                         user.imageurl ||
//                                         "/default-profilepic.jpg"
//                                     }
//                                 />
//                             </Link>
//                             <div>
//                                 <p>
//                                     {user.first} {user.last}
//                                 </p>
//                                 <button
//                                     onClick={() => {}}
//                                     className="friendsButton"
//                                 >
//                                     Accept FriendRequest
//                                 </button>
//                             </div>
//                         </div>
//                     ))}
//             </div>
//             <div>
//                 {/* <h3 className="acceptedFriends">See your Friends</h3> */}
//                 <div className="friendsContainer">
//                     <h3 className="acceptedFriendsText">See your Friends</h3>
//                     {friends &&
//                         friends.map((user) => (
//                             <div key={user.id}>
//                                 <Link to={"/user/" + user.id}>
//                                     <img
//                                         className="friendsPic"
//                                         src={
//                                             user.imageurl ||
//                                             "/default-profilepic.jpg"
//                                         }
//                                     />
//                                 </Link>
//                                 <div>
//                                     <p>
//                                         {user.first} {user.last}
//                                     </p>
//                                     <button
//                                         className="friendsButton"
//                                         onClick={() => {}}
//                                     >
//                                         Unfriend / End Friendship
//                                     </button>
//                                 </div>
//                             </div>
//                         ))}
//                 </div>
//             </div>
//         </div>
//     );
// }
