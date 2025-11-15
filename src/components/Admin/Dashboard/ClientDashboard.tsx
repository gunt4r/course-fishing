"use client";
import Wrapper from "../../Wrapper";
import { useAnalytics } from "@/app/queries/analytics/analyticsQuery";
import Loader from "../../Loader";
import { useTranslations } from "next-intl";
import Grid from "../../Grid";
import AnimatedNumber from "react-animated-numbers";
export default function ClientDashboard() {
  const { data: analytics, isLoading } = useAnalytics();
  const t = useTranslations("Dashboard");
  if (isLoading) return <Loader />;
  const analyticsData = [
    {
      title: t("count_orders"),
      value: analytics.countOrder,
    },
    {
      title: t("count_viewers"),
      value: analytics.countViewers,
    },
    {
      title: t("count_users"),
      value: analytics.registeredUsers,
    },
    {
      title: t("total_revenue"),
      value: analytics.totalRevenue,
      currency: "€",
    },
  ];
  const clampFunction = "clamp(1.125rem, 4vw, 2rem)";
  return (
    <div className="w-full min-h-screen bg-none place-content-center">
      <Grid className=" px-10 gap-8">
        {analyticsData.map((item, index) => (
          <Wrapper
            className="w-1/3 flex scrollbar-hide text-center items-center flex-col"
            key={index}
          >
            <div className={`${item.currency && "flex items-center gap-4"}`}>
              <AnimatedNumber
                animateToNumber={item.value}
                useThousandsSeparator
                fontStyle={{
                  fontSize: clampFunction,
                }}
                className=" text-cyan-50 text-center font-bold mt-4"
              />
              {item.currency && <p className="text-2xl">{item.currency}</p>}
            </div>
            <p className="text-2xl">{item.title}</p>
          </Wrapper>
        ))}
        <Wrapper className="max-h-[200px] overflow-x-hidden scrollbar-hide ">
          {analytics.lastOrders.map((order: any, index: number) => (
            <div
              className="flex items-center justify-between border-b border-gray-200 py-4"
              key={index}
            >
              <div>
                <h3 className=" font-medium text-[clamp(1.125rem,4vw,2rem]">
                  {order.user.email}
                </h3>
                <p className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="items-center flex">
                <AnimatedNumber
                  animateToNumber={order.totalAmount}
                  fontStyle={{
                    fontSize: clampFunction,
                  }}
                  useThousandsSeparator
                  className=" text-cyan-50 text-center  font-bold mt-4"
                />
                <p className="text-2xl">€</p>
              </div>
            </div>
          ))}
        </Wrapper>
        <Wrapper className="max-h-[200px] overflow-x-hidden">
          {analytics.monthlyRevenue.map((item: any, index: number) => (
            <div
              className="flex items-center scrollbar-hide justify-between border-b border-gray-200 py-4"
              key={index}
            >
              <div>
                <h3 className="text-4xl font-medium">{item.month} lună</h3>
              </div>
              <div className="flex items-center">
                <AnimatedNumber
                  animateToNumber={item.total}
                  useThousandsSeparator
                  fontStyle={{
                    fontSize: clampFunction,
                  }}
                  className=" text-cyan-50 text-center font-bold mt-4"
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
