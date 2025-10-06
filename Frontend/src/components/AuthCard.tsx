import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub, faGoogle } from '@fortawesome/free-brands-svg-icons';
import Button from "./ButtonComp"
import InputComp from './InputComp';
import InputBox from "./InputBox"
import { useEffect, useRef } from 'react';
import { useForm } from "react-hook-form"
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { fetchdata } from '../hooks/fetchdata';
import callToast from '../hooks/callToast';
import { useNavigate } from "react-router-dom";

const URL = "http://localhost:3000/api/auth/"


const baseSchema = z.object({
  name: z.string().optional(),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type AuthCardProps = {
  Auth: "SignIn" | "SignUp";
    SetAuth: React.Dispatch<React.SetStateAction<"SignIn" | "SignUp">>
};

const AuthCard: React.FC<AuthCardProps> = ({ Auth,SetAuth }: AuthCardProps) => {
  const navigate = useNavigate();
  const inputRefs = useRef([
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ]).current;

  // schema refined depending on Auth
  const schema = baseSchema.superRefine((data, ctx) => {
    if (Auth === "SignUp" && !data.name?.trim()) {
      ctx.addIssue({
        code: "custom",
        path: ["name"],
        message: "Name is required",
      });
    }
  });

  type FormData = z.infer<typeof schema>;

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    shouldUnregister: true, // important when toggling SignIn/SignUp
  });

  // extract refs from register
  const { ref: nameRef, ...nameReg } = register("name");
  const { ref: emailRef, ...emailReg } = register("email");
  const { ref: passRef, ...passReg } = register("password");

  const onSubmit = async (formdata: FormData) => {
    if (Auth === 'SignUp') {
      const promise = fetchdata({
        method: "POST",
        URL: URL + "signup",
        body: formdata,
      });
      callToast({ kind: "A", promise: promise });
      const { data, error } = await promise;
      if (!error) {
        const { token } = data;
        localStorage.setItem("token", token);
        navigate("/");
      } else {
        callToast({ kind: "B", text: "Service down", basic: "error" });
      }
    } else {
      const promise = fetchdata({
        method: "POST",
        URL: URL + "signin",
        body: formdata,
      });
      callToast({ kind: "A", promise: promise });
      const { data, error } = await promise;
      if (!error) {
        const { token } = data;
        localStorage.setItem("token", token);
        navigate("/");
      }
    }
  };

  const handleEnter = (e: KeyboardEvent) => {
    const active = document.activeElement as HTMLInputElement | null;
    if (!active) return;

    if (e.key === "Enter") {
      e.preventDefault();
      const index = inputRefs.findIndex(ref => ref.current === active);
      if (index === -1) return;
      if (!active.value.trim()) {
        callToast({ kind: "B", text: "Please enter a value before moving on", basic: "error" });
        return;
      }
      if (index + 1 === inputRefs.length) {
        const form = active.closest("form");
        form?.requestSubmit(); 
      } else {
        inputRefs[index + 1].current?.focus();
      }
    }
    if (e.key === "Backspace" && active.value === "") {
      e.preventDefault();
      const index = inputRefs.findIndex(ref => ref.current === active);
      if (index > 0) {
        inputRefs[index - 1].current?.focus();
      }
    }
  };

  const Servicedown = () => {
    callToast({ kind: "B", text: "Service down", basic: "error" });
  };

  useEffect(() => {
    window.addEventListener("keydown", handleEnter);
    return () => window.removeEventListener("keydown", handleEnter);
  }, []);

  useEffect(() => {
    if (Auth === "SignUp") {
      inputRefs[0].current?.focus();
    } else {
      inputRefs[1].current?.focus();
    }
  }, [Auth]);

  return (
    <form 
      onSubmit={handleSubmit(onSubmit)}
      className="h-full w-[100%] md:w-1/2 bg-transparent flex flex-col items-center justify-center">
      <h1 className="text-4xl h-[39px] w-full text-center">
        {Auth === 'SignUp' ? "Create your account" : "Welcome Back"}
      </h1>

      <div className="flex flex-row items-center justify-center my-5">
        <Button 
          type={"button"} 
          kind={"A"} 
          height={"h-[32px]"}
          width={"w-[110px]"}
          color={"bg-[var(--main3)]"} 
          onClick={() => { Servicedown() }}
          leftimage={<FontAwesomeIcon icon={faGithub} className="text-[16px]" />}
          text={"Github"} />
        <Button 
          type={"button"} 
          kind={"A"} 
          height="h-[32px]"
          width="w-[110px]"
          color={"bg-[var(--main3)]"} 
          onClick={() => { Servicedown() }}
          leftimage={<FontAwesomeIcon icon={faGoogle} className="text-[16px]" />}
          text={"Google"} />
      </div>

      <h5 className='text-[12px] h-[14.5px] w-full text-center'>
        Or Use email for registration
      </h5>

      {Auth === 'SignUp' &&
        <InputBox
          input={
            <InputComp
              {...nameReg}
              ref={(el) => {
                nameRef(el);
                inputRefs[0].current = el;
              }}
              type="text"
              placeholder="Name"
              width="w-80"
              height="h-12"
              fontColor="text-[var(--text2)]"
              bgColor="bg-[var(--inputbox)]"
              border="border-2 border-transparent"
              rounded="rounded-[13px]"
            />
          }
          error={errors.name?.message ?? ""}
        />
      }

      <InputBox
        input={
          <InputComp
            {...emailReg}
            ref={(el) => {
              emailRef(el);
              inputRefs[1].current = el;
            }}
            type="text"
            placeholder="Email"
            width="w-80"
            height="h-12"
            fontColor="text-[var(--text2)]"
            bgColor="bg-[var(--inputbox)]"
            border="border-2 border-transparent"
            rounded="rounded-[17px]"
          />
        }
        error={errors.email?.message ?? ""}
      />

      <InputBox
        input={
          <InputComp
            {...passReg}
            ref={(el) => {
              passRef(el);
              inputRefs[2].current = el;
            }}
            type="password"
            placeholder="Password"
            width="w-80"
            height="h-12"
            fontColor="text-[var(--text2)]"
            bgColor="bg-[var(--inputbox)]"
            border="border-2 border-transparent"
            rounded="rounded-[17px]"
          />
        }
        error={errors.password?.message ?? ""}
      />

      <Button
        type={"submit"}
        kind={"B"}
        height={"h-[32px]"}
        width={"w-[110px]"}        
        color={"bg-[var(--main1)]"}
        text={Auth === 'SignUp' ? "Sign Up" : "Sign In"}
      />
      <h3 className="block md:hidden mt-2">
        {Auth === "SignUp" ?"Already have an account?":"Don't have an account "}
        <button type="button" className="underline text-blue-500" onClick={Auth === "SignUp" ? () => SetAuth("SignIn") : () => SetAuth("SignUp")}>
          {Auth === "SignUp" ? "Sign In" : "Sign Up"}
        </button>
      </h3>
    </form>
  )
}

export default AuthCard;
