/* ============================================================
   MARFATIA — INVESTOR CHARTER DYNAMIC DATA SYSTEM
   Manages complaint tables (Monthly, 12-Month Trend, Annual Trend)
   with persistent storage and automatic 12-month windowing.
   ============================================================ */
(function() {
  'use strict';

  var STORAGE_KEY = 'MARFATIA_INVESTOR_CHARTER_DATA_V1';

  var DEFAULT_DATA = {
    "stockbroker": {
      title: "Stock Broker",
      entityName: "Marfatia Broking Pvt Ltd. (Stock Brokers)",
      currentMonth: "April 2026",
      table1: [
        { id: 1, source: "Directly from Investors", carried: 0, received: 0, pendingTotal: 0, resolved: 0, pendingEnd: 0, avgTime: 0 },
        { id: 2, source: "SEBI (SCORES)", carried: 0, received: 0, pendingTotal: 0, resolved: 0, pendingEnd: 0, avgTime: 0 },
        { id: 3, source: "Stock Exchanges", carried: 0, received: 0, pendingTotal: 0, resolved: 0, pendingEnd: 0, avgTime: 0 },
        { id: 4, source: "Other Sources (if any)", carried: 0, received: 0, pendingTotal: 0, resolved: 0, pendingEnd: 0, avgTime: 0 }
      ],
      monthlyTrend: [
        { month: "April 2025", carried: 0, received: 0, resolved: 0, pending: 0 },
        { month: "May 2025", carried: 0, received: 0, resolved: 0, pending: 0 },
        { month: "June 2025", carried: 0, received: 0, resolved: 0, pending: 0 },
        { month: "July 2025", carried: 0, received: 0, resolved: 0, pending: 0 },
        { month: "August 2025", carried: 0, received: 0, resolved: 0, pending: 0 },
        { month: "September 2025", carried: 0, received: 0, resolved: 0, pending: 0 },
        { month: "October 2025", carried: 0, received: 0, resolved: 0, pending: 0 },
        { month: "November 2025", carried: 0, received: 0, resolved: 0, pending: 0 },
        { month: "December 2025", carried: 0, received: 0, resolved: 0, pending: 0 },
        { month: "January 2026", carried: 0, received: 0, resolved: 0, pending: 0 },
        { month: "February 2026", carried: 0, received: 0, resolved: 0, pending: 0 },
        { month: "March 2026", carried: 0, received: 0, resolved: 0, pending: 0 }
      ],
      annualTrend: [
        { year: "2022-23", carried: 0, received: 0, resolved: 0, pending: 0 },
        { year: "2023-24", carried: 0, received: 0, resolved: 0, pending: 0 },
        { year: "2024-25", carried: 0, received: 0, resolved: 0, pending: 0 },
        { year: "2025-26", carried: 0, received: 0, resolved: 0, pending: 0 }
      ]
    },
    "dp": {
      title: "Depository Participant",
      entityName: "Marfatia Broking Pvt Ltd. (Depository Participant)",
      currentMonth: "April 2026",
      table1: [
        { id: 1, source: "Directly from Investors", carried: 0, received: 0, pendingTotal: 0, resolved: 0, pendingEnd: 0, avgTime: 0 },
        { id: 2, source: "SEBI (SCORES)", carried: 0, received: 0, pendingTotal: 0, resolved: 0, pendingEnd: 0, avgTime: 0 },
        { id: 3, source: "Stock Exchanges", carried: 0, received: 0, pendingTotal: 0, resolved: 0, pendingEnd: 0, avgTime: 0 },
        { id: 4, source: "Other Sources (if any)", carried: 0, received: 0, pendingTotal: 0, resolved: 0, pendingEnd: 0, avgTime: 0 }
      ],
      monthlyTrend: [
        { month: "April 2025", carried: 0, received: 0, resolved: 0, pending: 0 },
        { month: "May 2025", carried: 0, received: 0, resolved: 0, pending: 0 },
        { month: "June 2025", carried: 0, received: 0, resolved: 0, pending: 0 },
        { month: "July 2025", carried: 0, received: 0, resolved: 0, pending: 0 },
        { month: "August 2025", carried: 0, received: 0, resolved: 0, pending: 0 },
        { month: "September 2025", carried: 0, received: 0, resolved: 0, pending: 0 },
        { month: "October 2025", carried: 0, received: 0, resolved: 0, pending: 0 },
        { month: "November 2025", carried: 0, received: 0, resolved: 0, pending: 0 },
        { month: "December 2025", carried: 0, received: 0, resolved: 0, pending: 0 },
        { month: "January 2026", carried: 0, received: 0, resolved: 0, pending: 0 },
        { month: "February 2026", carried: 0, received: 0, resolved: 0, pending: 0 },
        { month: "March 2026", carried: 0, received: 0, resolved: 0, pending: 0 }
      ],
      annualTrend: [
        { year: "2022-23", carried: 0, received: 0, resolved: 0, pending: 0 },
        { year: "2023-24", carried: 0, received: 0, resolved: 0, pending: 0 },
        { year: "2024-25", carried: 0, received: 0, resolved: 0, pending: 0 },
        { year: "2025-26", carried: 0, received: 0, resolved: 0, pending: 0 }
      ]
    },
    "pms": {
      title: "Portfolio Manager",
      entityName: "Marfatia Broking Pvt Ltd. (Portfolio Management Services)",
      currentMonth: "April 2026",
      table1: [
        { id: 1, source: "Directly from Investors", carried: 0, received: 0, pendingTotal: 0, resolved: 0, pendingEnd: 0, avgTime: 0 },
        { id: 2, source: "SEBI (SCORES)", carried: 0, received: 0, pendingTotal: 0, resolved: 0, pendingEnd: 0, avgTime: 0 },
        { id: 3, source: "Stock Exchanges", carried: 0, received: 0, pendingTotal: 0, resolved: 0, pendingEnd: 0, avgTime: 0 },
        { id: 4, source: "Other Sources (if any)", carried: 0, received: 0, pendingTotal: 0, resolved: 0, pendingEnd: 0, avgTime: 0 }
      ],
      monthlyTrend: [
        { month: "April 2025", carried: 0, received: 0, resolved: 0, pending: 0 },
        { month: "May 2025", carried: 0, received: 0, resolved: 0, pending: 0 },
        { month: "June 2025", carried: 0, received: 0, resolved: 0, pending: 0 },
        { month: "July 2025", carried: 0, received: 0, resolved: 0, pending: 0 },
        { month: "August 2025", carried: 0, received: 0, resolved: 0, pending: 0 },
        { month: "September 2025", carried: 0, received: 0, resolved: 0, pending: 0 },
        { month: "October 2025", carried: 0, received: 0, resolved: 0, pending: 0 },
        { month: "November 2025", carried: 0, received: 0, resolved: 0, pending: 0 },
        { month: "December 2025", carried: 0, received: 0, resolved: 0, pending: 0 },
        { month: "January 2026", carried: 0, received: 0, resolved: 0, pending: 0 },
        { month: "February 2026", carried: 0, received: 0, resolved: 0, pending: 0 },
        { month: "March 2026", carried: 0, received: 0, resolved: 0, pending: 0 }
      ],
      annualTrend: [
        { year: "2022-23", carried: 0, received: 0, resolved: 0, pending: 0 },
        { year: "2023-24", carried: 0, received: 0, resolved: 0, pending: 0 },
        { year: "2024-25", carried: 0, received: 0, resolved: 0, pending: 0 },
        { year: "2025-26", carried: 0, received: 0, resolved: 0, pending: 0 }
      ]
    },
    "research-analyst": {
      title: "Research Analyst",
      entityName: "Marfatia Broking Pvt Ltd. (Research Analyst)",
      currentMonth: "April 2026",
      table1: [
        { id: 1, source: "Directly from Investors", carried: 0, received: 0, pendingTotal: 0, resolved: 0, pendingEnd: 0, avgTime: 0 },
        { id: 2, source: "SEBI (SCORES)", carried: 0, received: 0, pendingTotal: 0, resolved: 0, pendingEnd: 0, avgTime: 0 },
        { id: 3, source: "Stock Exchanges", carried: 0, received: 0, pendingTotal: 0, resolved: 0, pendingEnd: 0, avgTime: 0 },
        { id: 4, source: "Other Sources (if any)", carried: 0, received: 0, pendingTotal: 0, resolved: 0, pendingEnd: 0, avgTime: 0 }
      ],
      monthlyTrend: [
        { month: "April 2025", carried: 0, received: 0, resolved: 0, pending: 0 },
        { month: "May 2025", carried: 0, received: 0, resolved: 0, pending: 0 },
        { month: "June 2025", carried: 0, received: 0, resolved: 0, pending: 0 },
        { month: "July 2025", carried: 0, received: 0, resolved: 0, pending: 0 },
        { month: "August 2025", carried: 0, received: 0, resolved: 0, pending: 0 },
        { month: "September 2025", carried: 0, received: 0, resolved: 0, pending: 0 },
        { month: "October 2025", carried: 0, received: 0, resolved: 0, pending: 0 },
        { month: "November 2025", carried: 0, received: 0, resolved: 0, pending: 0 },
        { month: "December 2025", carried: 0, received: 0, resolved: 0, pending: 0 },
        { month: "January 2026", carried: 0, received: 0, resolved: 0, pending: 0 },
        { month: "February 2026", carried: 0, received: 0, resolved: 0, pending: 0 },
        { month: "March 2026", carried: 0, received: 0, resolved: 0, pending: 0 }
      ],
      annualTrend: [
        { year: "2022-23", carried: 0, received: 0, resolved: 0, pending: 0 },
        { year: "2023-24", carried: 0, received: 0, resolved: 0, pending: 0 },
        { year: "2024-25", carried: 0, received: 0, resolved: 0, pending: 0 },
        { year: "2025-26", carried: 0, received: 0, resolved: 0, pending: 0 }
      ]
    }
  };

  function loadAllData() {
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        var parsed = JSON.parse(saved);
        return Object.assign({}, DEFAULT_DATA, parsed);
      }
    } catch(e) {
      console.warn('[InvestorCharterData]', e);
    }
    return DEFAULT_DATA;
  }

  function saveAllData(data) {
    try {
      // Rule: Constrain monthly trend to max 12 months per entity
      Object.keys(data).forEach(function(key) {
        if (data[key] && Array.isArray(data[key].monthlyTrend)) {
          if (data[key].monthlyTrend.length > 12) {
            data[key].monthlyTrend = data[key].monthlyTrend.slice(-12);
          }
        }
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch(e) {
      console.error('[InvestorCharterData] Save failed:', e);
      return false;
    }
  }

  function renderEntityTables(entityKey, containerId) {
    var allData = loadAllData();
    var entity = allData[entityKey];
    if (!entity) return;

    var container = document.getElementById(containerId || 'investorCharterTablesContainer');
    if (!container) return;

    // Calculate Table 1 totals
    var t1Carried = 0, t1Received = 0, t1PendingTotal = 0, t1Resolved = 0, t1PendingEnd = 0, t1AvgSum = 0;
    entity.table1.forEach(function(r) {
      t1Carried += (parseInt(r.carried, 10) || 0);
      t1Received += (parseInt(r.received, 10) || 0);
      t1PendingTotal += (parseInt(r.pendingTotal, 10) || 0);
      t1Resolved += (parseInt(r.resolved, 10) || 0);
      t1PendingEnd += (parseInt(r.pendingEnd, 10) || 0);
      t1AvgSum += (parseInt(r.avgTime, 10) || 0);
    });
    var t1AvgFinal = Math.round(t1AvgSum / (entity.table1.length || 1));

    // Ensure 12-month window rule for Table 2
    var monthlyList = entity.monthlyTrend.slice(-12);

    // Calculate Table 3 totals
    var t3Carried = 0, t3Received = 0, t3Resolved = 0, t3Pending = 0;
    entity.annualTrend.forEach(function(r) {
      t3Carried += (parseInt(r.carried, 10) || 0);
      t3Received += (parseInt(r.received, 10) || 0);
      t3Resolved += (parseInt(r.resolved, 10) || 0);
      t3Pending += (parseInt(r.pending, 10) || 0);
    });

    var html = '' +
      '<div class="ic-tables-wrapper" style="margin-top: 32px;">' +
      '  <h2 id="ic-complaints-data" style="font-family:var(--font-disp); font-size:22px; font-weight:700; color:var(--green); margin-bottom:6px;">Investor Complaints Data for ' + entity.entityName + '</h2>' +
      '  <p style="color:var(--ink-soft); font-size:14px; margin-bottom:18px;"><b>Data for Every Month Ending – ' + entity.currentMonth + '</b></p>' +
      '  ' +
      '  <div class="table-wrap mb-4">' +
      '    <table class="dtable">' +
      '      <thead>' +
      '        <tr>' +
      '          <th>S.No</th>' +
      '          <th>Received from</th>' +
      '          <th>Carried forward from previous month</th>' +
      '          <th>Received during the month</th>' +
      '          <th>Total Pending</th>' +
      '          <th>Resolved*</th>' +
      '          <th>Pending at the end of the month**</th>' +
      '          <th>Average Resolution time^ (in days)</th>' +
      '        </tr>' +
      '      </thead>' +
      '      <tbody>' +
      entity.table1.map(function(r, idx) {
        return '<tr>' +
          '  <td>' + (idx + 1) + '</td>' +
          '  <td><strong>' + r.source + '</strong></td>' +
          '  <td>' + r.carried + '</td>' +
          '  <td>' + r.received + '</td>' +
          '  <td>' + r.pendingTotal + '</td>' +
          '  <td>' + r.resolved + '</td>' +
          '  <td>' + r.pendingEnd + '</td>' +
          '  <td>' + r.avgTime + '</td>' +
          '</tr>';
      }).join('') +
      '        <tr style="font-weight:700; background:rgba(8,117,59,0.06);">' +
      '          <td>5</td>' +
      '          <td>Grand Total</td>' +
      '          <td>' + t1Carried + '</td>' +
      '          <td>' + t1Received + '</td>' +
      '          <td>' + t1PendingTotal + '</td>' +
      '          <td>' + t1Resolved + '</td>' +
      '          <td>' + t1PendingEnd + '</td>' +
      '          <td>' + t1AvgFinal + '</td>' +
      '        </tr>' +
      '      </tbody>' +
      '    </table>' +
      '  </div>' +

      '  <h3 id="ic-monthly-trend" style="font-family:var(--font-disp); font-size:19px; font-weight:700; color:var(--green); margin:32px 0 12px;">Trend of Monthly Disposal of Complaints (Last 12 Months Only)</h3>' +
      '  <div class="table-wrap mb-4">' +
      '    <table class="dtable">' +
      '      <thead>' +
      '        <tr>' +
      '          <th>S.No</th>' +
      '          <th>Month</th>' +
      '          <th>Carried forward from previous month</th>' +
      '          <th>Received</th>' +
      '          <th>Resolved*</th>' +
      '          <th>Pending**</th>' +
      '        </tr>' +
      '      </thead>' +
      '      <tbody>' +
      monthlyList.map(function(r, idx) {
        return '<tr>' +
          '  <td>' + (idx + 1) + '</td>' +
          '  <td>' + r.month + '</td>' +
          '  <td>' + r.carried + '</td>' +
          '  <td>' + r.received + '</td>' +
          '  <td>' + r.resolved + '</td>' +
          '  <td>' + r.pending + '</td>' +
          '</tr>';
      }).join('') +
      '      </tbody>' +
      '    </table>' +
      '  </div>' +

      '  <h3 id="ic-annual-trend" style="font-family:var(--font-disp); font-size:19px; font-weight:700; color:var(--green); margin:32px 0 12px;">Trend of Annual Disposal of Complaints</h3>' +
      '  <div class="table-wrap mb-4">' +
      '    <table class="dtable">' +
      '      <thead>' +
      '        <tr>' +
      '          <th>S.No</th>' +
      '          <th>Year</th>' +
      '          <th>Carried forward from previous year</th>' +
      '          <th>Received during the year</th>' +
      '          <th>Resolved during the year</th>' +
      '          <th>Pending at the end of the year</th>' +
      '        </tr>' +
      '      </thead>' +
      '      <tbody>' +
      entity.annualTrend.map(function(r, idx) {
        return '<tr>' +
          '  <td>' + (idx + 1) + '</td>' +
          '  <td>' + r.year + '</td>' +
          '  <td>' + r.carried + '</td>' +
          '  <td>' + r.received + '</td>' +
          '  <td>' + r.resolved + '</td>' +
          '  <td>' + r.pending + '</td>' +
          '</tr>';
      }).join('') +
      '        <tr style="font-weight:700; background:rgba(8,117,59,0.06);">' +
      '          <td>' + (entity.annualTrend.length + 1) + '</td>' +
      '          <td>Grand Total</td>' +
      '          <td>' + t3Carried + '</td>' +
      '          <td>' + t3Received + '</td>' +
      '          <td>' + t3Resolved + '</td>' +
      '          <td>' + t3Pending + '</td>' +
      '        </tr>' +
      '      </tbody>' +
      '    </table>' +
      '  </div>' +
      '</div>';

    container.innerHTML = html;
  }

  window.InvestorCharterSystem = {
    loadAllData: loadAllData,
    saveAllData: saveAllData,
    renderEntityTables: renderEntityTables,
    DEFAULT_DATA: DEFAULT_DATA
  };
})();
