
/*
    documentaion for class: user
*/
class User{
	firstname;
	lastname;
	username;
	join_date;      // TODO: date when user jooined the app. means created account oh can we make account details separate from User class??
	#id;
	#password;      //TODO hash it and store the hash
	#contacts_map;  // a map key= id integer of user and value as that DON'T Store the objects!! it's redundance of data. use the id of user to get user obj from db.
	#groups_map;  // a map storing key = grp_name and value as grp_id samea for contacts_map key = user's name, and value = user's id.

	
	static user_counts; //TODO ya static so that when i re-run the program i can assign the count from where it lefted!! // but this is not the correct and robust way
	// how should this be done??? 
	
	constructor(username,password, firstname,lastname){
	    this.#id =  User.user_counts;
	    this.firstname = firstname;
	    	this.lastname = lastname;
	    this.username = username;
	    this.#password = this.#hash_password(password); 
	    this.#contacts_map = new Map();
	    this.#groups_map = new Map();       //TODO: Do I WILL NEed to provide the map the type of class it will store?? like Group , Contact etc or not? 
	    User.user_counts+=1;
	}
	#hash_password(password){
	        // TODO hashing logic 
	    return password; 
	}
	getId(){
	    return this.#id;
	}
	getPassword(){
	    return this.#password;
	}
	getContacts(){
	    return this.#contacts_map;
	}
	getGroups(){
	    return this.#groups_map;
	}
	getGroupById(firstname){
	    return this.#groups_map[firstname]; // return grp having key(name) and value grp_id.
	}
	getContactById(firstname){ // return list of people mathing the search instead of single !!! 
	    return this.#contacts_map[firstname]; // return grp having key(name) and value grp_id.
	}
		// TODO: IMP** use fuzzy search and display implement it on search and  return the list of people instead of just one
	addContact(firstname,id){
	    this.#contacts_map.set({firstname:id});
	}
	addGroup(firstname,id){
	    this.#groups_map.set({firstname:id}); // name here should be first name!!
	}

}

export  { User as User };

