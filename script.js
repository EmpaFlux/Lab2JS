window.addEventListener('load', function(event)
{
    const url = "https://www.forverkliga.se/JavaScript/api/crud.php?";
    let key = localStorage.getItem('LocalStorageKey');
    let atempts= 0;

    let addBookForm = document.getElementById('addBook')
    .addEventListener('submit', addBook);
    let fetchBookBtn = document.getElementById('fetchBookBtn')
    .addEventListener('click', fetchBooks);
    let getKeyBtn = document.getElementById('getKeyBtn')
    .addEventListener('click', getRequestKey);


    function addBook(e){
        e.preventDefault();
        let bookTitle = document.getElementById('addBookTitle').value;
        let bookAuthor = document.getElementById('addAuthor').value;
        let request = new Request(url + 'op=insert&key=' + key + '&title=' + bookTitle + '&author=' + bookAuthor, { method: 'POST'});

        fetch(request)
        .then(response => response.json())
        .then(function(data){
            if(data.status === "success" && atempts < 10){
            operationFinished(data);
        }
        else if(data.status !== "success" && atempts < 10){
            atempts++;
            return addBook(e);
        }
        else if(atempts >= 10){
            operationFailed(data);
        }
        })
        .catch(function (error){
            console.log(error);
        }
        )}

        function fetchBooks(){
            let request = new Request(url + 'op=select&key=' + key);
    
            fetch(request)
            .then(response => response.json())
            .then(data => {
                if(data.status === "success" && atempts < 10){
                    let bookListDiv = '<h3>Books:</h3>';
                    data.data.forEach(function(book){
                        bookListDiv += `
                            <ul>
                                <li>ID: ${book.id}</li>
                                <li>Title: ${book.title}</li>
                                <li>Author: ${book.author}</li>
                            </ul>`;
                    });
                    document.getElementById('bookListDiv').innerHTML = bookListDiv;
                    operationFinished(data);
                }
                else if(data.status !== "success" && atempts < 10){
                    atempts++;
                    return fetchBooks();
                }
                else if(atempts >= 10){

                    operationFailed(data);
                } 
            })
        }

        function getRequestKey(){
            let request = new Request(url + "requestKey");
    
            fetch(request)
            .then(function(response){
                return response.json();
            })
            .then(function(data){
                key = data.key;
                localStorage.setItem('LocalStorageKey', key);
                console.log("Key is: " + key);
                document.getElementById('keyDiv').innerText = 'Your key is: ' + key;
            })
        }

        function operationFinished(data){
            atempts++;
            temp = atempts;
            atempts = 0;
        }

        function operationFailed(data){
            temp = atempts;
            atempts = 0;
            
        }


});

