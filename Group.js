
/*
    documentaion for class: user
*/
class Group{
	#id;
	name;
	members;
	//TODO: complete the class by adding attributes and methods for all neccesury funtionality.
    static group_count = 1;
    members_count =0;
    
	constructor(name){
	 this.name=name;
	 this.#id = Group.group_count;
	 this.members_count =0;
	 this.members = [];// TODO: if initial members are given then add them. and try to use a dynamic arr (ADD atleast the user who created group at least and give role)
	 Group.group_count+=1;

	}
	
	getId(){
	    return this.#id;
	}
	addMember(memberid){
	    this.members[this.members_count] = Number(memberid);
	    this.members_count+=1;
	}
	// TODO: ADD list of members !
	
	

}

export  { Group as Group };

