import {React, useState} from 'react';



const Form = () => {
    return(
        <div className="form-container">
            <h2>Submit Your Case</h2>

            <form className="case-form" action="/submit-case" method="POST" encType="multipart/form-data"> 
                <label htmlFor="caseNumber">Case Number:</label>
                <input type="file" id="caseNumber" name="caseNumber" />
                <button type="submit">Submit</button>

                </form>
        </div> 
    )

}

export default Form;