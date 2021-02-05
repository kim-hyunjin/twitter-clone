import React, { useEffect, useState } from 'react';
import { dbService, storageService } from 'myFirebase';
import Kweet from 'components/Kweet';
import { v4 as uuidv4 } from 'uuid';

const Home = ({ userObj }) => {
        const [kweet, setKweet] = useState("");
        const [kweets, setKweets] = useState([]);
        const [attachment, setAttachment] = useState("");
        // const getKweets = async () => {
        //         const dbKweets = await dbService.collection("kweets").get();
        //         dbKweets.forEach((document) => {
        //                 const kweetObject = {
        //                         ...document.data(),
        //                         id: document.id
        //                 }
        //                 setKweets(prev => [kweetObject, ...prev]) // useState로 만든 Setter에 함수를 넣으주면 이전 값을 사용할 수 있음
        //         });
        // }
        useEffect(() => {
                dbService.collection("kweets").onSnapshot(snapshot => { // firesotre에 변경사항이 생길때마다 동작할 리스너
                        const kweetArray = snapshot.docs.map(doc => ({
                                id: doc.id,
                                ...doc.data()
                        }));
                        setKweets(kweetArray);
                })
        }, [])
        const onSubmit = async (event) => {
                event.preventDefault();
                let attachmentUrl = ""
                if (attachment !== "") {
                        const attachmentRef = storageService.ref().child(`${userObj.uid}/${uuidv4()}`);
                        const response = await attachmentRef.putString(attachment, "data_url");
                        attachmentUrl = await response.ref.getDownloadURL();
                }

                const kweetObj = {
                        text: kweet,
                        createdAt: Date.now(),
                        creatorId: userObj.uid,
                        attachmentUrl
                }
                await dbService.collection("kweets").add(kweetObj);
                setKweet("");
                setAttachment("");
        };
        const onChange = (event) => {
                const { target: { value } } = event;
                setKweet(value);
        };
        const onFileChange = (event) => {
                const { target: { files } } = event;
                const theFile = files[0];
                const reader = new FileReader();
                reader.onloadend = (finishedEvent) => {
                        const { currentTarget: { result } } = finishedEvent
                        setAttachment(result);
                }
                reader.readAsDataURL(theFile)
        };
        const onClearAttachment = () => {
                setAttachment(null)
        }
        return (
                <>
                        <form onSubmit={onSubmit}>
                                <input type="text" placeholder="What's on your mind?" value={kweet} maxLength={120} onChange={onChange} />
                                <input type="file" accept="image/*" onChange={onFileChange} />
                                <input type="submit" value="Kweet" />
                                {attachment && <div>
                                        <img src={attachment} width="50px" height="50px" />
                                        <button onClick={onClearAttachment}>Cancel</button>
                                </div>}
                        </form>
                        {kweets.map((kweet) => (
                                <Kweet key={kweet.id} kweetObj={kweet} isOwner={kweet.creatorId === userObj.uid} />
                        ))}
                </>
        )
}
export default Home