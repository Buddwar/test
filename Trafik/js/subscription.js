let countrycodes = {
"01": "Stockholms Län",
"03": "Uppsalas län",
"04": "Södermanlands län",
"05": "Östergötlands län",
"06": "Jönköpings län",
"07": "Kronobergs län",
"08": "Kalmar län",
"09": "Gotlands län",
"10": "Blekinge län",
"12": "Skåne län",
"13": "Hallands län",
"14": "Västra Götalands län",
"17": "Värmlands län",
"182": "Örebro län",
"19": "Västmanlands län",
"20": "Dalarnas län",
"21": "Gävleborgs län",
"22": "Västernorrlands län",
"23": "Jämtlands län",
"24": "Västerbottens län",
"25": "Norrbottens län"
}
  
  
  // Function to show success message
  function showSuccessMessage() {
    const successMessage = document.getElementById('success-message');
    successMessage.style.display = 'block';
    setTimeout(() => {
        successMessage.style.display = 'none';
    }, 3000);
}

// Save button click handler
document.getElementById('save-button').addEventListener('click', async () => {
    const countrycode = document.getElementById('update-frequency').value;
    /*Jag ändrade så att man kan uppdatera vilket län man prenumerar på */
    let result = await update_user_details(countrycode);//Functionen kommer returnera en dict tillbaka
    //Dicten kommer se ut likt följande > {'Success': 'True/False', 'Message': 'meddelande'}
    if(result['Success']){
        // Show success message
        showSuccessMessage();
        //Laddar om nuvarande fönstret så att uppdaterade uppgifter om användaren visas
        window.location.reload();
        console.log(result['Message']);
    }
});

// Cancel button click handler
document.getElementById('cancel-button').addEventListener('click', async() => {

    //Anropa databasen och logga ut användaren

    let result = await logout_user();
    if(result['Success']){
        window.location.href = 'index.html';
    }
    else{
        console.log('Problem uppstod med att logga ut användaren...');
    }
});

// Load user data (this would come from backend)
window.addEventListener('load', async () => {
    // This is where we would fetch the user's current subscription data
    // For demo purposes, we're using hardcoded values

    //Hämta användarens data
    let subscriber_data = await get_user_details();
    if(subscriber_data['Success']){//Om vi lyckades hämta data
        document.getElementById('subscriber-name').textContent = subscriber_data['Data']['fname'] + ' ' + subscriber_data['Data']['lname'];
        document.getElementById('subscriber-email').textContent = subscriber_data['Data']['email'];
        document.getElementById('subscriber-phone').textContent = subscriber_data['Data']['phone'];
        document.getElementById('subscriber-state').textContent = countrycodes[subscriber_data['Data']['countrycode']];
        document.getElementById('update-frequency').value = subscriber_data['Data']['subtype'];  
    }
    else{//Något gick tokigt med hämtningen av data, loggar bara det för tillfället
        console.log(subscriber_data)
    }
});

/*Function för att hämta användaren som är inloggad
Ingen data behöver skickas in här utan det räcker att bara anropa funktionen */
async function get_user_details(){
    let response = await fetch('https://bergstrom.pythonanywhere.com/get_user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },//Här skickar med vår sessionscookie från serversidan
        //o det är ju då för att kontrollera VEM det är som är inloggad
        credentials: 'include',
        body: JSON.stringify({})
    });
    let jsonResult = await response.json();
    return jsonResult;
}

/*Function för att uppdatera användaren som är inloggad
Endast countrycode behövs vid anrop av funktionen */
async function update_user_details(countrycode){
    let data = {'countrycode': countrycode}
    let response = await fetch('https://bergstrom.pythonanywhere.com/update_user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data)
    });
    let jsonResult = await response.json();
    return jsonResult;
}

  /*Function för att logga ut användaren */
  async function logout_user(){

    let response = await fetch('https://bergstrom.pythonanywhere.com/logout_user', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      credentials: 'include'
  });
    let jsonResult = await response.json();
    return jsonResult;
  }