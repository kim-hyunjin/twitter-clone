import React, { useEffect, useState } from 'react';
import { dbService } from 'myFirebase';

const Home = ({ userObj }) => {
        const [kweet, setKweet] = useState("");
        const [kweets, setKweets] = useState([]);
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
                dbService.collection("kweets").onSnapshot(snapshot => { // 리스너
                        const kweetArray = snapshot.docs.map(doc => ({
                                id: doc.id,
                                ...doc.data()
                        }));
                        setKweets(kweetArray);
                })
        }, [])
        const onSubmit = async (event) => {
                event.preventDefault();
                await dbService.collection("kweets").add({
                        text: kweet,
                        createdAt: Date.now(),
                        creatorId: userObj.uid
                });
                setKweet("");
        };
        const onChange = (event) => {
                const { target: { value } } = event;
                setKweet(value);
        };
        return (
                <>
                        <form onSubmit={onSubmit}>
                                <input type="text" placeholder="What's on your mind?" value={kweet} maxLength={120} onChange={onChange} />
                                <input type="submit" value="Kweet" />
                        </form>
                        <div>
                                {kweets.map(kweet => <div key={kweet.id}>
                                        <h4>{kweet.text}</h4>
                                </div>)}
                        </div>
                </>
        )
}
export default Home