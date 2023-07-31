function createTableFromJSON(headerData, jsonData) {
    // Create a table
    var table = document.createElement('table');
    table.setAttribute('class', 'expandable-table');

    // Create table header row
    var thead = document.createElement('thead');
    var headerRow = document.createElement('tr');
    headerData.forEach(function ({title, key, isHidden, sortable}) {
        if(isHidden) return;
        var th = document.createElement('th');
        th.appendChild(document.createTextNode(title));
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create table body
    var tbody = document.createElement('tbody');
    jsonData.forEach(function (obj, index) {
        var tr = document.createElement('tr');

        headerData.forEach(function ({title, key, isHidden, sortable}) {
            if(isHidden) return;
            var td = document.createElement('td');
            td.textContent = key === 'oid' && obj[key] === 0 ? '0' : (key === 'eventType' && !obj[key] ? 'none' : obj[key]);
            tr.appendChild(td);
        });

        tbody.appendChild(tr);

        // Create details rows for each item in pageObj array or each property in pageObj object
        var detailsRows = [];
        if (obj['pageObj']) {
            var detailsData = Array.isArray(obj['pageObj']) ? obj['pageObj'] : [obj['pageObj']];
            detailsData.forEach(function(item, detailIndex) {
                for (var key in item) {
                    var detailsRow = document.createElement('tr');
                    detailsRow.style.display = 'none'; // Hide details row by default

                    var tdDetails = document.createElement('td');
                    tdDetails.colSpan = headerData.length; // Make the td span across all columns of the parent table
                    tdDetails.setAttribute('class', 'details-row');

                    var detailCard = document.createElement('div');
                    detailCard.className = 'detail-card';
                    detailCard.setAttribute('data-role', 'detail-card');
                    detailCard.setAttribute('data-type', typeof item[key])

                    // detailCard.textContent = 'OID: ' + (index + 1) + '.' + (detailIndex + 1) + ', Key: ' + key + ', Value: ' + JSON.stringify(item[key]) + ', Type: ' + typeof item[key];
                    var detailCardOid = document.createElement('span');
                    detailCardOid.className = 'detail-card-value';
                    detailCardOid.setAttribute('data-role', 'oid');
                    detailCardOid.innerText = `${index}.${detailIndex + 1}`;
                    detailCard.appendChild(detailCardOid);

                    var detailCardKey = document.createElement('span');
                    detailCardKey.className = 'detail-card-value';
                    detailCardKey.setAttribute('data-role', 'key');
                    detailCardKey.innerText = key;
                    detailCard.appendChild(detailCardKey);

                    var detailCardValue = document.createElement('span');
                    detailCardValue.className = 'detail-card-value';
                    detailCardValue.setAttribute('data-role', 'value');
                    detailCardValue.innerText = JSON.stringify(item[key]);
                    detailCard.appendChild(detailCardValue);

                    var detailCardType = document.createElement('span');
                    detailCardType.className = 'detail-card-value';
                    detailCardType.setAttribute('data-role', 'type');
                    

                    detailCardType.innerText = typeof item[key];
                    detailCard.appendChild(detailCardType);

                    tdDetails.appendChild(detailCard);
                    detailsRow.appendChild(tdDetails);

                    tbody.appendChild(detailsRow); // Append the details row after the main row
                    detailsRows.push(detailsRow);
                }
            });
        }

        // Add click event to the row to toggle visibility of only the related details
        tr.addEventListener('click', function () {
            detailsRows.forEach(detailRow => detailRow.style.display = detailRow.style.display === 'none' ? '' : 'none');
            this.classList.toggle('expanded-row');
        });
    });
    table.appendChild(tbody);

    // Append the table to the element with id "table"
    document.getElementById('table').appendChild(table);
}

window.createTableFromJSON = createTableFromJSON;
export default createTableFromJSON;
