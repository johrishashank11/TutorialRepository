<%@taglib uri="/struts-tags" prefix="s"%>
<html>
<title>
</title>
<body>
<s:form action="login">
<s:textfield name="user" label="Username"></s:textfield>
<s:password name="pass" label="Password"></s:password>
<s:submit value="Submit"></s:submit>
</s:form>
</body>
</html>
