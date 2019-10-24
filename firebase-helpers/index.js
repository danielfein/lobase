class FirebaseHelpers {
    constructor(firebase) {
        this.db = firebase.firestore()
        this.auth = firebase.auth()
        this.timestamp = firebase.firestore.FieldValue.serverTimestamp()
        this.arrayUnion = firebase.firestore.FieldValue.arrayUnion()
        this.arrayRemove = firebase.firestore.FieldValue.arrayRemove()
    }
    user(){
        return firebase.auth().currentUser
    }

    userId(){
        return firebase.auth().currentUser.uid
    }


    docExists(path, onSuccess, onError){
        if(!onSuccess){
            onSuccess = doc => doc.exists ? true : false 
        }
        return this.db.doc(path).get()
                    .then(doc => doc.exists ? true : false )
                    .catch(error => onError ? onError(error) : console.log(error));
    }

    getDoc(path, onSuccess, onError){
        if(!onSuccess){
            onSuccess = (doc) => { 
                return { 
                    id: doc.id, ...doc.data()
                }
            }
        }
        if(!onError){
            onError = (error) => console.log(error)
        }
        return this.db.doc(path).get()
            .then(onSuccess)
            .catch(onError);
    }

    data(doc){
        return doc.exists ? { id: doc.id, ...doc.data() } : false
    }

    deleteDoc(path, onSuccess, onError){
        if(!onError){
            onError = (error) => console.log(error)
        }
        console.log(path, onSuccess)
        let d = this.db.doc(path).delete().then(onSuccess).catch(error => {
            console.log("Error", error)
        })
        return d
    }


    getDocs({path, where = [], orderBy, startAt, startAfter, endAt, endBefore}, onSuccess, onError){
        let query = this.db.collection(path)
        if(where){
            for (var key in where){
                query = query.where(where[key])
            }
        }
        if(orderBy){
            query = query.orderBy(orderBy)
        }
        if(startAt){
            query = query.startAt(offset)
        }else if(startAfter){
            query = query.startAt(offset)
        }

        if(endAt){
            query = query.startAt(offset)
        }else if(endBefore){
            query = query.startAt(offset)
        }

        if(!onSuccess){
            onSuccess = (docs) => { 
                let data = []
                docs.forEach(doc => {
                    data.push({ id: doc.id, ...doc.data() })
                })
                return data
            }
        }
        if(!onError){
            onError = (error) => console.log(error)
        }
        return this.db.query.get()
            .then(onSuccess)
            .catch(onError);
    }

    setDoc(path, data, options, onSuccess){
        return this.db.doc(path).set({ ...data }, options).then(onSuccess)
    }

    appendToList(path, list, data){
        return this.db.doc(path).update({ [list]: this.arrayUnion(data)})
    }

    removeFromList(path, list, data){
        return this.db.doc(path).update({ [list]: this.arrayRemove(data)})
    }
}

export default FirebaseHelpers