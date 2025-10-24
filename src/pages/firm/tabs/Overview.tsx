import React, { useMemo, useState, useEffect } from 'react';
import styled from 'styled-components';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../../../amplify/data/resource';
import { FaTruckLoading, FaTruckMoving } from 'react-icons/fa';
import DashboardActions from '../../../components/DashboardActions';
import RealtimeLoadsList from '../../../components/RealtimeLoadsList';
import {
  CreateQuoteModal,
  StartTenderModal,
  CallDriverModal,
  LaunchCollectionModal,
  PostUpdateModal,
} from '../../../components/ActionModals';

type Series = {
  name: string;
  color: string;
  data: number[];
};

type LineChartProps = {
  title: string;
  labels: string[];
  series: Series[];
  maxY?: number;
};

const Overview: React.FC = () => {
  // Initialize Amplify client after configuration
  const client = useMemo(() => generateClient<Schema>(), []);

  const [postedLoads, setPostedLoads] = useState<number>(0);
  const [prevPostedLoads, setPrevPostedLoads] = useState<number>(0);
  const [loadingPosted, setLoadingPosted] = useState<boolean>(true);

  const [truckLoads, setTruckLoads] = useState<number>(0);
  const [prevTruckLoads, setPrevTruckLoads] = useState<number>(0);
  const [loadingTrucks, setLoadingTrucks] = useState<boolean>(true);
  
  const [todayPickups, setTodayPickups] = useState<number>(0);
  const [yesterdayPickups, setYesterdayPickups] = useState<number>(0);
  const [todayDeliveries, setTodayDeliveries] = useState<number>(0);
  const [yesterdayDeliveries, setYesterdayDeliveries] = useState<number>(0);
  const [loadingPickups, setLoadingPickups] = useState<boolean>(true);
  const [loadingDeliveries, setLoadingDeliveries] = useState<boolean>(true);

  // Modal states
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [showTenderModal, setShowTenderModal] = useState(false);
  const [showCallModal, setShowCallModal] = useState(false);
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const getStartOfDay = (date: Date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const getEndOfDay = (date: Date) => {
    const d = new Date(date);
    d.setHours(23, 59, 59, 999);
    return d;
  };

  useEffect(() => {
    const cachedPosted = sessionStorage.getItem("postedLoadsData");
    const cachedTrucks = sessionStorage.getItem("truckLoadsData");
    const cachedPickups = sessionStorage.getItem("todayPickupsData");
    const cachedDeliveries = sessionStorage.getItem("todayDeliveriesData");
  
    let hasCache = false;
  
    if (cachedPosted) {
      const posted = JSON.parse(cachedPosted);
      setPostedLoads(posted.current);
      setPrevPostedLoads(posted.previous);
      setLoadingPosted(false);
      hasCache = true;
    }
    if (cachedTrucks) {
      const trucks = JSON.parse(cachedTrucks);
      setTruckLoads(trucks.current);
      setPrevTruckLoads(trucks.previous);
      setLoadingTrucks(false);
      hasCache = true;
    }
    if (cachedPickups) {
      const pickups = JSON.parse(cachedPickups);
      setTodayPickups(pickups.today);
      setYesterdayPickups(pickups.yesterday);
      setLoadingPickups(false);
      hasCache = true;
    }
    if (cachedDeliveries) {
      const deliveries = JSON.parse(cachedDeliveries);
      setTodayDeliveries(deliveries.today);
      setYesterdayDeliveries(deliveries.yesterday);
      setLoadingDeliveries(false);
      hasCache = true;
    }
  
    const fetchData = async () => {
      try {
        if (!hasCache) {
          setLoadingTrucks(true);
          setLoadingPosted(true);
          setLoadingPickups(true);
          setLoadingDeliveries(true);
        }
  
        const now = new Date();
        const todayStart = getStartOfDay(now);
        const todayEnd = getEndOfDay(now);
        const yesterdayStart = new Date(todayStart);
        yesterdayStart.setDate(yesterdayStart.getDate() - 1);
        const yesterdayEnd = new Date(todayEnd);
        yesterdayEnd.setDate(yesterdayEnd.getDate() - 1);
        
        const firstDayThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const firstDayNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        const firstDayPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  
        // Fetch data in parallel
        const [
          { data: postedCurrent },
          { data: postedPrev },
          { data: truckCurrent },
          { data: truckPrev },
          { data: todayPickupData },
          { data: yesterdayPickupData },
          { data: todayDeliveryData },
          { data: yesterdayDeliveryData }
        ] = await Promise.all([
          // Posted Loads (monthly)
          client.models.Load.list({
            filter: { createdAt: { between: [firstDayThisMonth.toISOString(), firstDayNextMonth.toISOString()] } }
          }),
          client.models.Load.list({
            filter: { createdAt: { between: [firstDayPrevMonth.toISOString(), firstDayThisMonth.toISOString()] } }
          }),
          // Truck Loads (monthly)
          client.models.Truck.list({
            filter: { createdAt: { between: [firstDayThisMonth.toISOString(), firstDayNextMonth.toISOString()] } }
          }),
          client.models.Truck.list({
            filter: { createdAt: { between: [firstDayPrevMonth.toISOString(), firstDayThisMonth.toISOString()] } }
          }),
          // Today's Pickups
          client.models.Load.list({
            filter: { 
              and: [
                { pickup_date: { ge: todayStart.toISOString() } },
                { pickup_date: { le: todayEnd.toISOString() } }
              ]
            }
          }),
          // Yesterday's Pickups
          client.models.Load.list({
            filter: { 
              and: [
                { pickup_date: { ge: yesterdayStart.toISOString() } },
                { pickup_date: { le: yesterdayEnd.toISOString() } }
              ]
            }
          }),
          // Today's Deliveries
          client.models.Load.list({
            filter: { 
              and: [
                { delivery_date: { ge: todayStart.toISOString() } },
                { delivery_date: { le: todayEnd.toISOString() } }
              ]
            }
          }),
          // Yesterday's Deliveries
          client.models.Load.list({
            filter: { 
              and: [
                { delivery_date: { ge: yesterdayStart.toISOString() } },
                { delivery_date: { le: yesterdayEnd.toISOString() } }
              ]
            }
          })
        ]);

        // Update state and cache
        setPostedLoads(postedCurrent.length);
        setPrevPostedLoads(postedPrev.length);
        sessionStorage.setItem("postedLoadsData", JSON.stringify({
          current: postedCurrent.length,
          previous: postedPrev.length,
        }));

        setTruckLoads(truckCurrent.length);
        setPrevTruckLoads(truckPrev.length);
        sessionStorage.setItem("truckLoadsData", JSON.stringify({
          current: truckCurrent.length,
          previous: truckPrev.length,
        }));

        setTodayPickups(todayPickupData.length);
        setYesterdayPickups(yesterdayPickupData.length);
        sessionStorage.setItem("todayPickupsData", JSON.stringify({
          today: todayPickupData.length,
          yesterday: yesterdayPickupData.length,
        }));

        setTodayDeliveries(todayDeliveryData.length);
        setYesterdayDeliveries(yesterdayDeliveryData.length);
        sessionStorage.setItem("todayDeliveriesData", JSON.stringify({
          today: todayDeliveryData.length,
          yesterday: yesterdayDeliveryData.length,
        }));
      } catch (err) {
        // Error fetching data
      } finally {
        setLoadingTrucks(false);
        setLoadingPosted(false);
        setLoadingPickups(false);
        setLoadingDeliveries(false);
      }
    };
  
    fetchData();
  }, []);
  
  

  // --- Percentage change calculations ---
  const postedGrowth = prevPostedLoads > 0
    ? (((postedLoads - prevPostedLoads) / prevPostedLoads) * 100).toFixed(1)
    : "0";
  const truckGrowth = prevTruckLoads > 0
    ? (((truckLoads - prevTruckLoads) / prevTruckLoads) * 100).toFixed(1)
    : "0";

  // Calculate percentage changes
  const pickupGrowth = yesterdayPickups > 0 
    ? (((todayPickups - yesterdayPickups) / yesterdayPickups) * 100).toFixed(1)
    : todayPickups > 0 ? '100' : '0';
    
  const deliveryGrowth = yesterdayDeliveries > 0
    ? (((todayDeliveries - yesterdayDeliveries) / yesterdayDeliveries) * 100).toFixed(1)
    : todayDeliveries > 0 ? '100' : '0';

  const kpis = [
    { 
      label: 'Posted Loads', 
      value: loadingPosted ? '...' : postedLoads, 
      change: `${postedGrowth}%`, 
      changeColor: Number(postedGrowth) >= 0 ? '#22c55e' : '#ef4444',
      icon: null
    },
    { 
      label: 'Truck Loads', 
      value: loadingTrucks ? '...' : truckLoads, 
      change: `${truckGrowth}%`, 
      changeColor: Number(truckGrowth) >= 0 ? '#22c55e' : '#ef4444',
      icon: null
    },
    { 
      label: 'Today\'s Pickups',
      value: loadingPickups ? '...' : todayPickups,
      change: `${pickupGrowth}%`,
      changeColor: Number(pickupGrowth) >= 0 ? '#22c55e' : '#ef4444',
      icon: <FaTruckLoading style={{ color: '#3b82f6', marginRight: '8px' }} />
    },
    { 
      label: 'Today\'s Deliveries',
      value: loadingDeliveries ? '...' : todayDeliveries,
      change: `${deliveryGrowth}%`,
      changeColor: Number(deliveryGrowth) >= 0 ? '#22c55e' : '#ef4444',
      icon: <FaTruckMoving style={{ color: '#8b5cf6', marginRight: '8px' }} />
    }
  ] as const;

  // Chart Data (static example for now)
  const labels = ['Jan','Feb','Mar','Apr','May','June','July','Aug','Sept','Oct','Nov','Dec'];

  const chart1: Series[] = [
    { name: 'Impressions', color: '#0d6efd', data: [1200,500,1100,900,1700,1200,1300,200,1900,1000,1950,1850] },
    { name: 'Posted Loads', color: '#ef4444', data: [800,450,520,880,1200,980,1100,250,400,500,480,1800] },
    { name: 'Truck Loads', color: '#f59e0b', data: [1000,900,850,950,600,500,700,1200,1300,600,950,400] },
  ];

  const chart2: Series[] = [
    { name: 'Posted Loads', color: '#ef4444', data: [300,260,280,400,600,700,650,300,800,350,600,1000] },
    { name: 'Truck Loads', color: '#0d6efd', data: [500,450,700,650,900,750,1000,200,950,700,1000,950] },
    { name: 'Users', color: '#f59e0b', data: [200,240,300,350,380,520,620,700,820,600,900,500] },
  ];

  return (
    <Container>
    <DashboardActions
      onCreateQuote={() => setShowQuoteModal(true)}
      onStartTender={() => setShowTenderModal(true)}
      onCallDriver={() => setShowCallModal(true)}
      onLaunchCollection={() => setShowCollectionModal(true)}
      onPostUpdate={() => setShowUpdateModal(true)}
    />

    <RealtimeLoadsList />

    <SectionHeader>View your impressions, trucks loads, posted loads over time.</SectionHeader>
    <KPIGrid>
      {kpis.map((k) => (
        <KpiCard 
          key={k.label} 
          aria-label={`${k.label} ${k.value} (${k.change})`}
          data-label={k.label}
        >
          <KpiLabel>
            {k.icon || null}
            {k.label}
          </KpiLabel>
          <KpiValueRow>
            <KpiValue>{typeof k.value === 'number' ? k.value.toLocaleString() : k.value}</KpiValue>
            <KpiDelta style={{ color: k.changeColor }}>{k.change}</KpiDelta>
          </KpiValueRow>
        </KpiCard>
      ))}
    </KPIGrid>

    <ChartSection>
      <SectionHeader>See how your loads and trucks grew over time.</SectionHeader>
      <ChartCard>
        <ResponsiveLineChart title="" labels={labels} series={chart1} />
      </ChartCard>
    </ChartSection>

    <ChartSection>
      <SectionHeader>View your current users posted loads and truck loads over time.</SectionHeader>
      <ChartCard>
        <ResponsiveLineChart title="" labels={labels} series={chart2} />
      </ChartCard>
    </ChartSection>

    {/* Action Modals */}
    <CreateQuoteModal isOpen={showQuoteModal} onClose={() => setShowQuoteModal(false)} />
    <StartTenderModal isOpen={showTenderModal} onClose={() => setShowTenderModal(false)} />
    <CallDriverModal isOpen={showCallModal} onClose={() => setShowCallModal(false)} />
    <LaunchCollectionModal isOpen={showCollectionModal} onClose={() => setShowCollectionModal(false)} />
      <PostUpdateModal isOpen={showUpdateModal} onClose={() => setShowUpdateModal(false)} />
    </Container>
  );
};

export default Overview;

// --- Chart Component (unchanged) --- //
const ResponsiveLineChart: React.FC<LineChartProps> = ({ title, labels, series, maxY }) => {
  const padding = { top: 18, right: 18, bottom: 30, left: 36 };
  const gridLines = 4;

  const computed = useMemo(() => {
    const allValues = series.flatMap((s) => s.data);
    const maxVal = Math.max(maxY ?? 0, ...allValues, 1);
    const niceMax = Math.ceil(maxVal / 100) * 100;
    return { niceMax };
  }, [series, maxY]);

  return (
    <ChartWrap>
      {title ? <ChartTitle>{title}</ChartTitle> : null}
      <Svg viewBox="0 0 800 320" role="img" aria-label="line chart" preserveAspectRatio="none">
        <g transform={`translate(${padding.left},${padding.top})`}>
          <rect x={0} y={0} width={800 - padding.left - padding.right} height={320 - padding.top - padding.bottom} fill="#ffffff" />
          {Array.from({ length: gridLines + 1 }).map((_, i) => {
            const areaH = 320 - padding.top - padding.bottom;
            const y = (i / gridLines) * areaH;
            return <line key={i} x1={0} y1={y} x2={800 - padding.left - padding.right} y2={y} stroke="rgba(107,114,128,0.2)" strokeWidth={1} />;
          })}
          {series.map((s, si) => (
            <g key={si}>
              <path d={makePath(s.data, labels.length, padding, computed.niceMax)} fill="none" stroke={s.color} strokeWidth={2} />
              {s.data.map((v, i) => {
                const { px, py } = pointAt(i, v, labels.length, padding, computed.niceMax);
                return <circle key={i} cx={px} cy={py} r={3} fill={s.color} />;
              })}
            </g>
          ))}
          {labels.map((lbl, i) => {
            const areaW = 800 - padding.left - padding.right;
            const x = (i / (labels.length - 1)) * areaW;
            const y = 320 - padding.top - padding.bottom + 16;
            return (
              <text key={lbl} x={x} y={y} textAnchor="middle" fontSize={11} fill="#6b7280">
                {lbl}
              </text>
            );
          })}
          <text x={-8} y={-6} textAnchor="end" fontSize={11} fill="#6b7280">
            {computed.niceMax.toLocaleString()}
          </text>
        </g>
      </Svg>
      <Legend>
        {series.map((s) => (
          <LegendItem key={s.name}>
            <Swatch style={{ backgroundColor: s.color }} />
            <span>{s.name}</span>
          </LegendItem>
        ))}
      </Legend>
    </ChartWrap>
  );
};


// Helpers
function makePath(data: number[], n: number, pad: { top: number; right: number; bottom: number; left: number }, max: number) {
  const coords = data.map((v, i) => pointAt(i, v, n, pad, max));
  return coords.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.px} ${p.py}`).join(' ');
}

function pointAt(i: number, v: number, n: number, pad: { top: number; right: number; bottom: number; left: number }, max: number) {
  const areaW = 800 - pad.left - pad.right;
  const areaH = 320 - pad.top - pad.bottom;
  const px = (i / (n - 1)) * areaW;
  const py = areaH - (Math.max(0, v) / max) * areaH;
  return { px, py };
}

// styled-components kept below the components per project rules
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SectionHeader = styled.h4`
  margin: 0;
  padding: 6px 2px;
  font-weight: 600;
  color: #374151;
  font-size: clamp(13px, 1.8vw, 14px);
`;

const KPIGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.25rem;
  margin-bottom: 2rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const KpiCard = styled.div`
  background: #ffffff;
  border: 1px solid rgba(40, 44, 69, 0.10);
  border-radius: 10px;
  padding: 14px;
`;

const KpiLabel = styled.div`
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
`;

const KpiValueRow = styled.div`
  display: flex;
  align-items: baseline;
`;

const KpiValue = styled.div`
  font-weight: 800;
  color: #111827;
  font-size: clamp(22px, 3.6vw, 28px);
`;

const KpiDelta = styled.div`
  font-weight: 700;
  font-size: 12px;
`;

const ChartSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ChartCard = styled.div`
  background: #ffffff;
  border: 1px solid rgba(40, 44, 69, 0.10);
  border-radius: 10px;
  padding: 10px;
`;

const ChartWrap = styled.div`
  width: 100%;
`;

const ChartTitle = styled.h5`
  margin: 0 0 6px 0;
  color: #1f2937;
  font-size: 14px;
`;

const Svg = styled.svg`
  width: 100%;
  height: auto;
  display: block;
  aspect-ratio: 800 / 320;
`;

const Legend = styled.div`
  display: inline-flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 8px;
`;

const LegendItem = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #374151;
  font-size: 12px;
`;

const Swatch = styled.span`
  width: 12px;
  height: 12px;
  border-radius: 3px;
  display: inline-block;
`;