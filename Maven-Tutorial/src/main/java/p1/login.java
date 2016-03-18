package p1;

public class login 
{
private String user;

public String getUser() {
	return user;
}

public void setUser(String user) {
	this.user = user;
}

public String execute()
{
	try
	{
		return "success";
	}
	catch(Exception e)
	{
		e.printStackTrace();
	}
	return "fail";
}
}
