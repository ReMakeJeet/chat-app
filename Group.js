
/*
    documentaion for class: user
*/
class Group{
	#id;
	name;
	members;
	//TODO: complete the class by adding attributes and methods for all neccesury funtionality.
    static group_count = 1;
    members_count =1;
    
	constructor(name){
	 this.name=name;
	 this.#id = group_count;
	 this.members = [];// TODO: if initial members are given then add them. and try to use a dynamic arr (ADD atleast the user who created group at least and give role)
	 group_count = group_count+1;
	}
	
	getId(){
	    return this.#id;
	}
	addMember(memberid){
	    this.members[members_count] = memberid;
	    members_count+=1;
	}
	// TODO: ADD list of members !
	
	

}

export  { Group as Group };

