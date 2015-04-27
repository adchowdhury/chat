<%@include file="dbconnect.jsp" %>

<c:set var="lastRowID" value="${param.maxID}"/>

<sql:query dataSource="${snapshot}" var="result">
	SELECT * FROM (SELECT *, date_format(CONVERT_TZ(chatdate, "-0:00", "-5:30"),'%d-%m-%Y %r') as cdt from chat where ID > ? order by ID desc limit 50) as ch order by ID;
	<sql:param value="${lastRowID}" />
</sql:query>

<c:choose>
	<c:when test="${param.maxID eq 0}">
<table border='0' style='font-size: 10pt; color: blue; font-family: verdana, arial;' width="98%">
	</c:when>
</c:choose>


<c:forEach var="row" items="${result.rows}">
	<tr title='<c:out value="${row.cdt}"/>'>
	   <td><b><c:out value="${row.username}"/></b><input type="hidden" value="<c:out value="${row.id}"/>"/> </td>	  
<c:choose>
	<c:when test="${param.showTime eq 'true'}">
		<td>[<c:out value="${row.cdt}"/>]:&nbsp;</td>
	</c:when>
</c:choose>
	   <td><c:out value="${row.msg}"/></td>	   
	</tr>
</c:forEach>

<c:choose>
	<c:when test="${lastRowID eq 0}">
</table>
	</c:when>
</c:choose>