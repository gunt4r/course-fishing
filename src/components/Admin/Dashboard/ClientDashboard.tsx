'use client';
import { useTranslations } from 'next-intl';
import AnimatedNumber from 'react-animated-numbers';
import { useAnalytics } from '@/app/queries/analytics/analyticsQuery';
import Grid from '../../Grid';
import Loader from '../../Loader';
import Wrapper from '../../Wrapper';

export default function ClientDashboard() {
  const { data: analytics, isLoading } = useAnalytics();
  const t = useTranslations('Dashboard');
  if (isLoading) {
    return <Loader />;
  }
  const analyticsData = [
    {
      title: t('count_orders'),
      value: analytics.countOrder,
    },
    {
      title: t('count_viewers'),
      value: analytics.countViewers,
    },
    {
      title: t('count_users'),
      value: analytics.registeredUsers,
    },
    {
      title: t('total_revenue'),
      value: analytics.totalRevenue,
      currency: '€',
    },
  ];
  const clampFunction = 'clamp(1.125rem, 4vw, 2rem)';
  return (
    <div className="min-h-screen w-full place-content-center bg-none">
      <Grid className=" gap-8 px-10">
        {analyticsData.map((item, index) => (
          <Wrapper
            className="scrollbar-hide flex w-1/3 flex-col items-center text-center"
            key={index}
          >
            <div className={`${item.currency && 'flex items-center gap-4'}`}>
              <AnimatedNumber
                animateToNumber={item.value}
                useThousandsSeparator
                fontStyle={{
                  fontSize: clampFunction,
                }}
                className=" mt-4 text-center font-bold text-cyan-50"
              />
              {item.currency && <p className="text-2xl">{item.currency}</p>}
            </div>
            <p className="text-2xl">{item.title}</p>
          </Wrapper>
        ))}
        <Wrapper className="scrollbar-hide max-h-[200px] overflow-x-hidden ">
          {analytics.lastOrders.map((order: any, index: number) => (
            <div
              className="flex items-center justify-between border-b border-gray-200 py-4"
              key={index}
            >
              <div>
                <h3 className=" text-[clamp(1.125rem,4vw,2rem] font-medium">
                  {order.user.email}
                </h3>
                <p className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center">
                <AnimatedNumber
                  animateToNumber={order.totalAmount}
                  fontStyle={{
                    fontSize: clampFunction,
                  }}
                  useThousandsSeparator
                  className=" mt-4 text-center  font-bold text-cyan-50"
                />
                <p className="text-2xl">€</p>
              </div>
            </div>
          ))}
        </Wrapper>
        <Wrapper className="max-h-[200px] overflow-x-hidden">
          {analytics.monthlyRevenue.map((item: any, index: number) => (
            <div
              className="scrollbar-hide flex items-center justify-between border-b border-gray-200 py-4"
              key={index}
            >
              <div>
                <h3 className="text-4xl font-medium">
                  {item.month}
                  {' '}
                  lună
                </h3>
              </div>
              <div className="flex items-center">
                <AnimatedNumber
                  animateToNumber={item.total}
                  useThousandsSeparator
                  fontStyle={{
                    fontSize: clampFunction,
                  }}
                  className=" mt-4 text-center font-bold text-cyan-50"
                />
                <p className="text-2xl">€</p>
              </div>
            </div>
          ))}
        </Wrapper>
      </Grid>
    </div>
  );
}
