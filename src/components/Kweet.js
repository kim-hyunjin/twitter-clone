import { dbService, storageService } from 'myFirebase';
import React, { useState } from 'react';

const Kweet = ({ kweetObj, isOwner }) => {
        const [editing, setEditing] = useState(false);
        const [newKweet, setNewKweet] = useState(kweetObj.text);
        const onDeleteClick = async () => {
                const ok = window.confirm("Are you sure you want to delete this kweet?");
                if (ok) {
                        await dbService.doc(`kweets/${kweetObj.id}`).delete();
                        await storageService.refFromURL(kweetObj.attachmentUrl).delete();
                }
        };
        const toggleEditing = () => setEditing(prev => !prev);
        const onChange = (event) => {
                const { target: { value } } = event;
                setNewKweet(value);
        }
        const onSubmit = async (event) => {
                event.preventDefault();
                await dbService.doc(`kweets/${kweetObj.id}`).update({
                        text: newKweet
                });
                setEditing(false);
        }


        return (
                <div>
                        {editing ?
                                <>
                                        <form onSubmit={onSubmit}>
                                                <input type="text" value={newKweet} required onChange={onChange} />
                                                <input type="submit" value="Update Kweet" />
                                        </form>
                                        <button onClick={toggleEditing}>Cancel</button>
                                </> :
                                <>
                                        <h4>{kweetObj.text}</h4>
                                        {kweetObj.attachmentUrl && <img src={kweetObj.attachmentUrl} width="50px" height="50px" />}
                                        {isOwner && (<>
                                                <button onClick={onDeleteClick}>Delete Kweet</button>
                                                <button onClick={toggleEditing}>Edit Kweet</button>
                                        </>)}
                                </>
                        }
                </div>
        )
};

export default Kweet;